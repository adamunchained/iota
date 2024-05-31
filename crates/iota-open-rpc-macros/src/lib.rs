// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use derive_syn_parse::Parse;
use itertools::Itertools;
use proc_macro::TokenStream;
use proc_macro2::{Ident, Span, TokenStream as TokenStream2, TokenTree};
use quote::{quote, ToTokens, TokenStreamExt};
use syn::{
    parse,
    parse::{Parse, ParseStream},
    parse_macro_input,
    punctuated::Punctuated,
    spanned::Spanned,
    token::{Comma, Paren},
    Attribute, GenericArgument, LitStr, PatType, Path, PathArguments, Token, TraitItem, Type,
};
use unescape::unescape;

const IOTA_RPC_ATTRS: [&str; 2] = ["deprecated", "version"];

/// Add a [Service name]OpenRpc struct and implementation providing access to
/// Open RPC doc builder. This proc macro must be use in conjunction with
/// `jsonrpsee_proc_macro::rpc`
///
/// The generated method `open_rpc` is added to [Service name]OpenRpc,
/// ideally we want to add this to the trait generated by jsonrpsee framework,
/// creating a new struct to provide access to the method is a workaround.
///
/// TODO: consider contributing the open rpc doc macro to jsonrpsee to simplify
/// the logics.
#[proc_macro_attribute]
pub fn open_rpc(attr: TokenStream, item: TokenStream) -> TokenStream {
    let attr: OpenRpcAttributes = parse_macro_input!(attr);

    let mut trait_data: syn::ItemTrait = syn::parse(item).unwrap();
    let rpc_definition = parse_rpc_method(&mut trait_data).unwrap();

    let namespace = attr
        .find_attr("namespace")
        .map(|str| str.value())
        .unwrap_or_default();

    let tag = attr.find_attr("tag").to_quote();

    let methods = rpc_definition.methods.iter().map(|method|{
        let name = &method.name;
        let deprecated = method.deprecated;
        let doc = &method.doc;
        let mut inputs = Vec::new();
        for (name, ty, description) in &method.params {
            let (ty, required) = extract_type_from_option(ty.clone());
            let description = if let Some(description) = description {
                quote! {Some(#description.to_string())}
            } else {
                quote! {None}
            };

            inputs.push(quote! {
                let des = builder.create_content_descriptor::<#ty>(#name, None, #description, #required);
                inputs.push(des);
            })
        }
        let returns_ty = if let Some(ty) = &method.returns {
            let (ty, required) = extract_type_from_option(ty.clone());
            let name = quote! {#ty}.to_string();
            quote! {Some(builder.create_content_descriptor::<#ty>(#name, None, None, #required));}
        } else {
            quote! {None;}
        };

        if method.is_pubsub {
            quote! {
                let mut inputs: Vec<iota_open_rpc::ContentDescriptor> = Vec::new();
                #(#inputs)*
                let result = #returns_ty
                builder.add_subscription(#namespace, #name, inputs, result, #doc, #tag, #deprecated);
            }
        } else {
            quote! {
                let mut inputs: Vec<iota_open_rpc::ContentDescriptor> = Vec::new();
                #(#inputs)*
                let result = #returns_ty
                builder.add_method(#namespace, #name, inputs, result, #doc, #tag, #deprecated);
            }
        }
    }).collect::<Vec<_>>();

    let routes = rpc_definition
        .version_routing
        .into_iter()
        .map(|route| {
            let name = route.name;
            let route_to = route.route_to;
            let comparator = route.token.to_string();
            let version = route.version;
            quote! {
                builder.add_method_routing(#namespace, #name, #route_to, #comparator, #version);
            }
        })
        .collect::<Vec<_>>();

    let open_rpc_name = quote::format_ident!("{}OpenRpc", &rpc_definition.name);

    quote! {
        #trait_data
        pub struct #open_rpc_name;
        impl #open_rpc_name {
            pub fn module_doc() -> iota_open_rpc::Module{
                let mut builder = iota_open_rpc::RpcModuleDocBuilder::default();
                #(#methods)*
                #(#routes)*
                builder.build()
            }
        }
    }
    .into()
}

trait OptionalQuote {
    fn to_quote(&self) -> TokenStream2;

    fn unwrap_quote<F>(&self, quote: F) -> TokenStream2
    where
        F: FnOnce(LitStr) -> TokenStream2;
}

impl OptionalQuote for Option<LitStr> {
    fn to_quote(&self) -> TokenStream2 {
        if let Some(value) = self {
            quote!(Some(#value.to_string()))
        } else {
            quote!(None)
        }
    }

    fn unwrap_quote<F>(&self, quote: F) -> TokenStream2
    where
        F: FnOnce(LitStr) -> TokenStream2,
    {
        if let Some(lit_str) = self {
            quote(lit_str.clone())
        } else {
            quote!()
        }
    }
}

struct RpcDefinition {
    name: Ident,
    methods: Vec<Method>,
    version_routing: Vec<Routing>,
}
struct Method {
    name: String,
    params: Vec<(String, Type, Option<String>)>,
    returns: Option<Type>,
    doc: String,
    is_pubsub: bool,
    deprecated: bool,
}
struct Routing {
    name: String,
    route_to: String,
    token: TokenStream2,
    version: String,
}

fn parse_rpc_method(trait_data: &mut syn::ItemTrait) -> Result<RpcDefinition, syn::Error> {
    let mut methods = Vec::new();
    let mut version_routing = Vec::new();
    for trait_item in &mut trait_data.items {
        if let TraitItem::Method(method) = trait_item {
            let doc = extract_doc_comments(&method.attrs).to_string();
            let params: Vec<_> = method
                .sig
                .inputs
                .iter_mut()
                .filter_map(|arg| {
                    match arg {
                        syn::FnArg::Receiver(_) => None,
                        syn::FnArg::Typed(arg) => {
                            let description = if let Some(description) = arg.attrs.iter().position(|a|a.path.is_ident("doc")){
                                let doc = extract_doc_comments(&arg.attrs);
                                arg.attrs.remove(description);
                                Some(doc)
                            }else{
                                None
                            };
                            match *arg.pat.clone() {
                                syn::Pat::Ident(name) => {
                                    Some(get_type(arg).map(|ty| (name.ident.to_string(), ty, description)))
                                }
                                syn::Pat::Wild(wild) => Some(Err(syn::Error::new(
                                    wild.underscore_token.span(),
                                    "Method argument names must be valid Rust identifiers; got `_` instead",
                                ))),
                                _ => Some(Err(syn::Error::new(
                                    arg.span(),
                                    format!("Unexpected method signature input; got {:?} ", *arg.pat),
                                ))),
                            }
                        },
                    }
                })
                .collect::<Result<_, _>>()?;

            let (method_name, returns, is_pubsub, deprecated) = if let Some(attr) =
                find_attr(&mut method.attrs, "method")
            {
                let token: TokenStream = attr.tokens.clone().into();
                let returns = match &method.sig.output {
                    syn::ReturnType::Default => None,
                    syn::ReturnType::Type(_, output) => extract_type_from(output, "RpcResult"),
                };
                let mut attributes = parse::<Attributes>(token)?;
                let method_name = attributes.get_value("name");
                let deprecated = attributes.find("deprecated").is_some();

                if let Some(version_attr) = attributes.find("version") {
                    if let (Some(token), Some(version)) = (&version_attr.token, &version_attr.value)
                    {
                        let route_to =
                            format!("{method_name}_{}", version.value().replace('.', "_"));
                        version_routing.push(Routing {
                            name: method_name,
                            route_to: route_to.clone(),
                            token: token.to_token_stream(),
                            version: version.value(),
                        });
                        if let Some(name) = attributes.find_mut("name") {
                            name.value
                                .replace(LitStr::new(&route_to, Span::call_site()));
                        }
                        attr.tokens = remove_iota_rpc_attributes(attributes);
                        continue;
                    }
                }
                attr.tokens = remove_iota_rpc_attributes(attributes);
                (method_name, returns, false, deprecated)
            } else if let Some(attr) = find_attr(&mut method.attrs, "subscription") {
                let token: TokenStream = attr.tokens.clone().into();
                let attributes = parse::<Attributes>(token)?;
                let name = attributes.get_value("name");
                let type_ = attributes
                    .find("item")
                    .expect("Subscription should have a [item] attribute")
                    .type_
                    .clone()
                    .expect("[item] attribute should have a value");
                let deprecated = attributes.find("deprecated").is_some();
                attr.tokens = remove_iota_rpc_attributes(attributes);
                (name, Some(type_), true, deprecated)
            } else {
                panic!("Unknown method name")
            };

            methods.push(Method {
                name: method_name,
                params,
                returns,
                doc,
                is_pubsub,
                deprecated,
            });
        }
    }
    Ok(RpcDefinition {
        name: trait_data.ident.clone(),
        methods,
        version_routing,
    })
}
// Remove IOTA rpc specific attributes.
fn remove_iota_rpc_attributes(attributes: Attributes) -> TokenStream2 {
    let attrs = attributes
        .attrs
        .into_iter()
        .filter(|r| !IOTA_RPC_ATTRS.contains(&r.key.to_string().as_str()))
        .collect::<Punctuated<Attr, Comma>>();
    quote! {(#attrs)}
}

fn extract_type_from(ty: &Type, from_ty: &str) -> Option<Type> {
    fn path_is(path: &Path, from_ty: &str) -> bool {
        path.leading_colon.is_none()
            && path.segments.len() == 1
            && path.segments.iter().next().unwrap().ident == from_ty
    }

    if let Type::Path(p) = ty {
        if p.qself.is_none() && path_is(&p.path, from_ty) {
            if let PathArguments::AngleBracketed(a) = &p.path.segments[0].arguments {
                if let Some(GenericArgument::Type(ty)) = a.args.first() {
                    return Some(ty.clone());
                }
            }
        }
    }
    None
}

fn extract_type_from_option(ty: Type) -> (Type, bool) {
    if let Some(ty) = extract_type_from(&ty, "Option") {
        (ty, false)
    } else {
        (ty, true)
    }
}

fn get_type(pat_type: &mut PatType) -> Result<Type, syn::Error> {
    Ok(
        if let Some((pos, attr)) = pat_type
            .attrs
            .iter()
            .find_position(|a| a.path.is_ident("schemars"))
        {
            let attribute = parse::<NamedAttribute>(attr.tokens.clone().into())?;

            let stream = syn::parse_str(&attribute.value.value())?;
            let tokens = respan_token_stream(stream, attribute.value.span());

            let path = syn::parse2(tokens)?;
            pat_type.attrs.remove(pos);
            path
        } else {
            pat_type.ty.as_ref().clone()
        },
    )
}

fn find_attr<'a>(attrs: &'a mut [Attribute], ident: &str) -> Option<&'a mut Attribute> {
    attrs.iter_mut().find(|a| a.path.is_ident(ident))
}

fn respan_token_stream(stream: TokenStream2, span: Span) -> TokenStream2 {
    stream
        .into_iter()
        .map(|mut token| {
            if let TokenTree::Group(g) = &mut token {
                *g = proc_macro2::Group::new(g.delimiter(), respan_token_stream(g.stream(), span));
            }
            token.set_span(span);
            token
        })
        .collect()
}

fn extract_doc_comments(attrs: &[Attribute]) -> String {
    let s = attrs
        .iter()
        .filter(|attr| {
            attr.path.is_ident("doc")
                && match attr.parse_meta() {
                    Ok(syn::Meta::NameValue(meta)) => matches!(&meta.lit, syn::Lit::Str(_)),
                    _ => false,
                }
        })
        .map(|attr| {
            let s = attr.tokens.to_string();
            s[4..s.len() - 1].to_string()
        })
        .join(" ");
    unescape(&s).unwrap_or_else(|| panic!("Cannot unescape doc comments : [{s}]"))
}

#[derive(Parse, Debug)]
struct OpenRpcAttributes {
    #[parse_terminated(OpenRpcAttribute::parse)]
    fields: Punctuated<OpenRpcAttribute, Token![,]>,
}

impl OpenRpcAttributes {
    fn find_attr(&self, name: &str) -> Option<LitStr> {
        self.fields
            .iter()
            .find(|attr| attr.label == name)
            .map(|attr| attr.value.clone())
    }
}

#[derive(Parse, Debug)]
struct OpenRpcAttribute {
    label: Ident,
    _eq_token: Token![=],
    value: syn::LitStr,
}

#[derive(Parse, Debug)]
struct NamedAttribute {
    #[paren]
    _paren_token: Paren,
    #[inside(_paren_token)]
    _ident: Ident,
    #[inside(_paren_token)]
    _eq_token: Token![=],
    #[inside(_paren_token)]
    value: syn::LitStr,
}

#[derive(Debug)]
struct Attributes {
    pub attrs: Punctuated<Attr, syn::token::Comma>,
}

impl Attributes {
    pub fn find(&self, attr_name: &str) -> Option<&Attr> {
        self.attrs.iter().find(|attr| attr.key == attr_name)
    }
    pub fn find_mut(&mut self, attr_name: &str) -> Option<&mut Attr> {
        self.attrs.iter_mut().find(|attr| attr.key == attr_name)
    }
    pub fn get_value(&self, attr_name: &str) -> String {
        self.attrs
            .iter()
            .find(|attr| attr.key == attr_name)
            .unwrap_or_else(|| panic!("Method should have a [{attr_name}] attribute."))
            .value
            .as_ref()
            .unwrap_or_else(|| panic!("[{attr_name}] attribute should have a value"))
            .value()
    }
}

impl Parse for Attributes {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let content;
        let _paren = syn::parenthesized!(content in input);
        let attrs = content.parse_terminated(Attr::parse)?;
        Ok(Self { attrs })
    }
}

#[derive(Debug)]
struct Attr {
    pub key: Ident,
    pub token: Option<TokenStream2>,
    pub value: Option<syn::LitStr>,
    pub type_: Option<Type>,
}

impl ToTokens for Attr {
    fn to_tokens(&self, tokens: &mut TokenStream2) {
        tokens.append(self.key.clone());
        if let Some(token) = &self.token {
            tokens.extend(token.to_token_stream());
        }
        if let Some(value) = &self.value {
            tokens.append(value.token());
        }
        if let Some(type_) = &self.type_ {
            tokens.extend(type_.to_token_stream());
        }
    }
}

impl Parse for Attr {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let key = input.parse()?;
        let token = if input.peek(Token!(=)) {
            Some(input.parse::<Token!(=)>()?.to_token_stream())
        } else if input.peek(Token!(<=)) {
            Some(input.parse::<Token!(<=)>()?.to_token_stream())
        } else {
            None
        };

        let value = if token.is_some() && input.peek(syn::LitStr) {
            Some(input.parse::<syn::LitStr>()?)
        } else {
            None
        };

        let type_ = if token.is_some() && input.peek(syn::Ident) {
            Some(input.parse::<Type>()?)
        } else {
            None
        };

        Ok(Self {
            key,
            token,
            value,
            type_,
        })
    }
}
