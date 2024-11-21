(function() {var type_impls = {
"iota_bridge":[["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-AsRef%3C%5Bu8%5D%3E-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-AsRef%3C%5Bu8%5D%3E-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/convert/trait.AsRef.html\" title=\"trait core::convert::AsRef\">AsRef</a>&lt;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>]&gt; for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.as_ref\" class=\"method trait-impl\"><a href=\"#method.as_ref\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.80.1/core/convert/trait.AsRef.html#tymethod.as_ref\" class=\"fn\">as_ref</a>(&amp;self) -&gt; &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>] <a href=\"#\" class=\"tooltip\" data-notable-ty=\"&amp;[u8]\">ⓘ</a></h4></section></summary><div class='docblock'>Converts this type into a shared reference of the (usually inferred) input type.</div></details></div></details>","AsRef<[u8]>","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Debug-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-Debug-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/fmt/trait.Debug.html\" title=\"trait core::fmt::Debug\">Debug</a> for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.fmt\" class=\"method trait-impl\"><a href=\"#method.fmt\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.80.1/core/fmt/trait.Debug.html#tymethod.fmt\" class=\"fn\">fmt</a>(&amp;self, f: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.80.1/core/fmt/struct.Formatter.html\" title=\"struct core::fmt::Formatter\">Formatter</a>&lt;'_&gt;) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.80.1/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.unit.html\">()</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.80.1/core/fmt/struct.Error.html\" title=\"struct core::fmt::Error\">Error</a>&gt;</h4></section></summary><div class='docblock'>Formats the value using the given formatter. <a href=\"https://doc.rust-lang.org/1.80.1/core/fmt/trait.Debug.html#tymethod.fmt\">Read more</a></div></details></div></details>","Debug","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Deserialize%3C'de%3E-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-Deserialize%3C'de%3E-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;'de&gt; <a class=\"trait\" href=\"https://docs.rs/serde/1.0.210/serde/de/trait.Deserialize.html\" title=\"trait serde::de::Deserialize\">Deserialize</a>&lt;'de&gt; for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.deserialize\" class=\"method trait-impl\"><a href=\"#method.deserialize\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://docs.rs/serde/1.0.210/serde/de/trait.Deserialize.html#tymethod.deserialize\" class=\"fn\">deserialize</a>&lt;D&gt;(\n    deserializer: D,\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.80.1/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;Secp256k1KeyPair, &lt;D as <a class=\"trait\" href=\"https://docs.rs/serde/1.0.210/serde/de/trait.Deserializer.html\" title=\"trait serde::de::Deserializer\">Deserializer</a>&lt;'de&gt;&gt;::<a class=\"associatedtype\" href=\"https://docs.rs/serde/1.0.210/serde/de/trait.Deserializer.html#associatedtype.Error\" title=\"type serde::de::Deserializer::Error\">Error</a>&gt;<div class=\"where\">where\n    D: <a class=\"trait\" href=\"https://docs.rs/serde/1.0.210/serde/de/trait.Deserializer.html\" title=\"trait serde::de::Deserializer\">Deserializer</a>&lt;'de&gt;,</div></h4></section></summary><div class='docblock'>Deserialize this value from the given Serde deserializer. <a href=\"https://docs.rs/serde/1.0.210/serde/de/trait.Deserialize.html#tymethod.deserialize\">Read more</a></div></details></div></details>","Deserialize<'de>","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-From%3CSecp256k1PrivateKey%3E-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-From%3CSecp256k1PrivateKey%3E-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;Secp256k1PrivateKey&gt; for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.from\" class=\"method trait-impl\"><a href=\"#method.from\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.80.1/core/convert/trait.From.html#tymethod.from\" class=\"fn\">from</a>(secret: Secp256k1PrivateKey) -&gt; Secp256k1KeyPair</h4></section></summary><div class='docblock'>Converts to this type from the input type.</div></details></div></details>","From<Secp256k1PrivateKey>","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-FromStr-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-FromStr-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/str/traits/trait.FromStr.html\" title=\"trait core::str::traits::FromStr\">FromStr</a> for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle\" open><summary><section id=\"associatedtype.Err\" class=\"associatedtype trait-impl\"><a href=\"#associatedtype.Err\" class=\"anchor\">§</a><h4 class=\"code-header\">type <a href=\"https://doc.rust-lang.org/1.80.1/core/str/traits/trait.FromStr.html#associatedtype.Err\" class=\"associatedtype\">Err</a> = FastCryptoError</h4></section></summary><div class='docblock'>The associated error which can be returned from parsing.</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.from_str\" class=\"method trait-impl\"><a href=\"#method.from_str\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.80.1/core/str/traits/trait.FromStr.html#tymethod.from_str\" class=\"fn\">from_str</a>(\n    s: &amp;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.str.html\">str</a>,\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.80.1/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;Secp256k1KeyPair, &lt;Secp256k1KeyPair as <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/str/traits/trait.FromStr.html\" title=\"trait core::str::traits::FromStr\">FromStr</a>&gt;::<a class=\"associatedtype\" href=\"https://doc.rust-lang.org/1.80.1/core/str/traits/trait.FromStr.html#associatedtype.Err\" title=\"type core::str::traits::FromStr::Err\">Err</a>&gt;</h4></section></summary><div class='docblock'>Parses a string <code>s</code> to return a value of this type. <a href=\"https://doc.rust-lang.org/1.80.1/core/str/traits/trait.FromStr.html#tymethod.from_str\">Read more</a></div></details></div></details>","FromStr","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-KeypairTraits-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-KeypairTraits-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl KeyPair for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><section id=\"associatedtype.PubKey\" class=\"associatedtype trait-impl\"><a href=\"#associatedtype.PubKey\" class=\"anchor\">§</a><h4 class=\"code-header\">type <a class=\"associatedtype\">PubKey</a> = Secp256k1PublicKey</h4></section><section id=\"associatedtype.PrivKey\" class=\"associatedtype trait-impl\"><a href=\"#associatedtype.PrivKey\" class=\"anchor\">§</a><h4 class=\"code-header\">type <a class=\"associatedtype\">PrivKey</a> = Secp256k1PrivateKey</h4></section><section id=\"associatedtype.Sig\" class=\"associatedtype trait-impl\"><a href=\"#associatedtype.Sig\" class=\"anchor\">§</a><h4 class=\"code-header\">type <a class=\"associatedtype\">Sig</a> = Secp256k1Signature</h4></section><details class=\"toggle method-toggle\" open><summary><section id=\"method.public\" class=\"method trait-impl\"><a href=\"#method.public\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">public</a>(&amp;self) -&gt; &amp;&lt;Secp256k1KeyPair as KeyPair&gt;::PubKey</h4></section></summary><div class='docblock'>Get the public key.</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.private\" class=\"method trait-impl\"><a href=\"#method.private\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">private</a>(self) -&gt; &lt;Secp256k1KeyPair as KeyPair&gt;::PrivKey</h4></section></summary><div class='docblock'>Get the private key.</div></details><section id=\"method.copy\" class=\"method trait-impl\"><a href=\"#method.copy\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">copy</a>(&amp;self) -&gt; Secp256k1KeyPair</h4></section><details class=\"toggle method-toggle\" open><summary><section id=\"method.generate\" class=\"method trait-impl\"><a href=\"#method.generate\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">generate</a>&lt;R&gt;(rng: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.reference.html\">&amp;mut R</a>) -&gt; Secp256k1KeyPair<div class=\"where\">where\n    R: AllowedRng,</div></h4></section></summary><div class='docblock'>Generate a new keypair using the given RNG.</div></details></div></details>","KeyPair","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-PartialEq-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-PartialEq-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/cmp/trait.PartialEq.html\" title=\"trait core::cmp::PartialEq\">PartialEq</a> for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.eq\" class=\"method trait-impl\"><a href=\"#method.eq\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.80.1/core/cmp/trait.PartialEq.html#tymethod.eq\" class=\"fn\">eq</a>(&amp;self, other: &amp;Secp256k1KeyPair) -&gt; <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.bool.html\">bool</a></h4></section></summary><div class='docblock'>This method tests for <code>self</code> and <code>other</code> values to be equal, and is used\nby <code>==</code>.</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.ne\" class=\"method trait-impl\"><span class=\"rightside\"><span class=\"since\" title=\"Stable since Rust version 1.0.0\">1.0.0</span> · <a class=\"src\" href=\"https://doc.rust-lang.org/1.80.1/src/core/cmp.rs.html#263\">source</a></span><a href=\"#method.ne\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.80.1/core/cmp/trait.PartialEq.html#method.ne\" class=\"fn\">ne</a>(&amp;self, other: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.reference.html\">&amp;Rhs</a>) -&gt; <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.bool.html\">bool</a></h4></section></summary><div class='docblock'>This method tests for <code>!=</code>. The default implementation is almost always\nsufficient, and should not be overridden without very good reason.</div></details></div></details>","PartialEq","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-RecoverableSigner-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-RecoverableSigner-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl RecoverableSigner for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.sign_recoverable_with_hash\" class=\"method trait-impl\"><a href=\"#method.sign_recoverable_with_hash\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">sign_recoverable_with_hash</a>&lt;H&gt;(\n    &amp;self,\n    msg: &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>],\n) -&gt; Secp256k1RecoverableSignature<div class=\"where\">where\n    H: HashFunction&lt;32&gt;,</div></h4></section></summary><div class=\"docblock\"><p>Create a new recoverable signature over the given message. The hash function <code>H</code> is used to hash the message.</p>\n</div></details><section id=\"associatedtype.PubKey\" class=\"associatedtype trait-impl\"><a href=\"#associatedtype.PubKey\" class=\"anchor\">§</a><h4 class=\"code-header\">type <a class=\"associatedtype\">PubKey</a> = Secp256k1PublicKey</h4></section><section id=\"associatedtype.Sig\" class=\"associatedtype trait-impl\"><a href=\"#associatedtype.Sig\" class=\"anchor\">§</a><h4 class=\"code-header\">type <a class=\"associatedtype\">Sig</a> = Secp256k1RecoverableSignature</h4></section><details class=\"toggle method-toggle\" open><summary><section id=\"method.sign_recoverable\" class=\"method trait-impl\"><a href=\"#method.sign_recoverable\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">sign_recoverable</a>(&amp;self, msg: &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>]) -&gt; Self::Sig</h4></section></summary><div class='docblock'>Sign as a recoverable signature.</div></details></div></details>","RecoverableSigner","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.sign_with_hash\" class=\"method\"><h4 class=\"code-header\">pub fn <a class=\"fn\">sign_with_hash</a>&lt;H&gt;(&amp;self, msg: &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>]) -&gt; Secp256k1Signature<div class=\"where\">where\n    H: HashFunction&lt;32&gt;,</div></h4></section></summary><div class=\"docblock\"><p>Create a new signature using the given hash function to hash the message.</p>\n</div></details></div></details>",0,"iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Serialize-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-Serialize-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serialize.html\" title=\"trait serde::ser::Serialize\">Serialize</a> for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.serialize\" class=\"method trait-impl\"><a href=\"#method.serialize\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serialize.html#tymethod.serialize\" class=\"fn\">serialize</a>&lt;S&gt;(\n    &amp;self,\n    serializer: S,\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.80.1/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;&lt;S as <a class=\"trait\" href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serializer.html\" title=\"trait serde::ser::Serializer\">Serializer</a>&gt;::<a class=\"associatedtype\" href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serializer.html#associatedtype.Ok\" title=\"type serde::ser::Serializer::Ok\">Ok</a>, &lt;S as <a class=\"trait\" href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serializer.html\" title=\"trait serde::ser::Serializer\">Serializer</a>&gt;::<a class=\"associatedtype\" href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serializer.html#associatedtype.Error\" title=\"type serde::ser::Serializer::Error\">Error</a>&gt;<div class=\"where\">where\n    S: <a class=\"trait\" href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serializer.html\" title=\"trait serde::ser::Serializer\">Serializer</a>,</div></h4></section></summary><div class='docblock'>Serialize this value into the given Serde serializer. <a href=\"https://docs.rs/serde/1.0.210/serde/ser/trait.Serialize.html#tymethod.serialize\">Read more</a></div></details></div></details>","Serialize","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Signer%3CSecp256k1Signature%3E-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-Signer%3CSecp256k1Signature%3E-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl Signer&lt;Secp256k1Signature&gt; for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.sign\" class=\"method trait-impl\"><a href=\"#method.sign\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">sign</a>(&amp;self, msg: &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>]) -&gt; Secp256k1Signature</h4></section></summary><div class='docblock'>Create a new signature over a message.</div></details></div></details>","Signer<Secp256k1Signature>","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Signer%3CSignature%3E-for-Secp256k1KeyPair\" class=\"impl\"><a class=\"src rightside\" href=\"src/iota_types/crypto.rs.html#890\">source</a><a href=\"#impl-Signer%3CSignature%3E-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl Signer&lt;<a class=\"enum\" href=\"iota_types/crypto/enum.Signature.html\" title=\"enum iota_types::crypto::Signature\">Signature</a>&gt; for Secp256k1KeyPair</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.sign\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/iota_types/crypto.rs.html#891\">source</a><a href=\"#method.sign\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">sign</a>(&amp;self, msg: &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>]) -&gt; <a class=\"enum\" href=\"iota_types/crypto/enum.Signature.html\" title=\"enum iota_types::crypto::Signature\">Signature</a></h4></section></summary><div class='docblock'>Create a new signature over a message.</div></details></div></details>","Signer<Signature>","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-ToFromBytes-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-ToFromBytes-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl ToFromBytes for Secp256k1KeyPair</h3></section></summary><div class=\"docblock\"><p>The bytes form of the keypair always only contain the private key bytes</p>\n</div><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.from_bytes\" class=\"method trait-impl\"><a href=\"#method.from_bytes\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">from_bytes</a>(bytes: &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>]) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.80.1/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;Secp256k1KeyPair, FastCryptoError&gt;</h4></section></summary><div class='docblock'>Parse an object from its byte representation</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.as_bytes\" class=\"method trait-impl\"><a href=\"#method.as_bytes\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a class=\"fn\">as_bytes</a>(&amp;self) -&gt; &amp;[<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.80.1/std/primitive.u8.html\">u8</a>] <a href=\"#\" class=\"tooltip\" data-notable-ty=\"&amp;[u8]\">ⓘ</a></h4></section></summary><div class='docblock'>Borrow a byte slice representing the serialized form of this object</div></details></div></details>","ToFromBytes","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<section id=\"impl-Eq-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-Eq-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/cmp/trait.Eq.html\" title=\"trait core::cmp::Eq\">Eq</a> for Secp256k1KeyPair</h3></section>","Eq","iota_bridge::crypto::BridgeAuthorityKeyPair"],["<section id=\"impl-StructuralPartialEq-for-Secp256k1KeyPair\" class=\"impl\"><a href=\"#impl-StructuralPartialEq-for-Secp256k1KeyPair\" class=\"anchor\">§</a><h3 class=\"code-header\">impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.80.1/core/marker/trait.StructuralPartialEq.html\" title=\"trait core::marker::StructuralPartialEq\">StructuralPartialEq</a> for Secp256k1KeyPair</h3></section>","StructuralPartialEq","iota_bridge::crypto::BridgeAuthorityKeyPair"]]
};if (window.register_type_impls) {window.register_type_impls(type_impls);} else {window.pending_type_impls = type_impls;}})()