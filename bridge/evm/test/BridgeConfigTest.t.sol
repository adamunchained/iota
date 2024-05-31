// SPDX-License-Identifier: MIT

// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "./mocks/MockTokens.sol";
import "./BridgeBaseTest.t.sol";

contract BridgeConfigTest is BridgeBaseTest {
    function setUp() public {
        setUpBridgeTest();
    }

    function testBridgeConfigInitialization() public {
        assertTrue(config.getTokenAddress(1) == wBTC);
        assertTrue(config.getTokenAddress(2) == wETH);
        assertTrue(config.getTokenAddress(3) == USDC);
        assertTrue(config.getTokenAddress(4) == USDT);
        assertEq(config.getIOTADecimal(0), 9);
        assertEq(config.getIOTADecimal(1), 8);
        assertEq(config.getIOTADecimal(2), 8);
        assertEq(config.getIOTADecimal(3), 6);
        assertEq(config.getIOTADecimal(4), 6);
        assertEq(config.chainID(), chainID);
        assertTrue(config.supportedChains(0));
    }

    function testGetAddress() public {
        assertEq(config.getTokenAddress(1), wBTC);
    }

    function testconvertERC20ToIOTADecimalAmountTooLargeForUint64() public {
        vm.expectRevert(bytes("BridgeConfig: Amount too large for uint64"));
        config.convertERC20ToIOTADecimal(BridgeMessage.ETH, type(uint256).max);
    }

    function testconvertERC20ToIOTADecimalInvalidIOTADecimal() public {
        vm.startPrank(address(bridge));
        address smallUSDC = address(new MockSmallUSDC());
        address[] memory _supportedTokens = new address[](4);
        _supportedTokens[0] = wBTC;
        _supportedTokens[1] = wETH;
        _supportedTokens[2] = smallUSDC;
        _supportedTokens[3] = USDT;
        uint8[] memory _supportedDestinationChains = new uint8[](1);
        _supportedDestinationChains[0] = 0;
        BridgeConfig newBridgeConfig =
            new BridgeConfig(chainID, _supportedTokens, _supportedDestinationChains);
        vm.expectRevert(bytes("BridgeConfig: Invalid IOTA decimal"));
        newBridgeConfig.convertERC20ToIOTADecimal(3, 100);
    }

    function testconvertIOTAToERC20DecimalInvalidIOTADecimal() public {
        vm.startPrank(address(bridge));
        address smallUSDC = address(new MockSmallUSDC());
        address[] memory _supportedTokens = new address[](4);
        _supportedTokens[0] = wBTC;
        _supportedTokens[1] = wETH;
        _supportedTokens[2] = smallUSDC;
        _supportedTokens[3] = USDT;
        uint8[] memory _supportedDestinationChains = new uint8[](1);
        _supportedDestinationChains[0] = 0;
        BridgeConfig newBridgeConfig =
            new BridgeConfig(chainID, _supportedTokens, _supportedDestinationChains);
        vm.expectRevert(bytes("BridgeConfig: Invalid IOTA decimal"));
        newBridgeConfig.convertIOTAToERC20Decimal(3, 100);
    }

    function testIsTokenSupported() public {
        assertTrue(config.isTokenSupported(1));
        assertTrue(!config.isTokenSupported(0));
    }

    function testGetIOTADecimal() public {
        assertEq(config.getIOTADecimal(1), 8);
    }

    function testconvertERC20ToIOTADecimal() public {
        // ETH
        assertEq(IERC20Metadata(wETH).decimals(), 18);
        uint256 ethAmount = 10 ether;
        uint64 iotaAmount = config.convertERC20ToIOTADecimal(BridgeMessage.ETH, ethAmount);
        assertEq(iotaAmount, 10_000_000_00); // 10 * 10 ^ 8

        // USDC
        assertEq(IERC20Metadata(USDC).decimals(), 6);
        ethAmount = 50_000_000; // 50 USDC
        iotaAmount = config.convertERC20ToIOTADecimal(BridgeMessage.USDC, ethAmount);
        assertEq(iotaAmount, ethAmount);

        // USDT
        assertEq(IERC20Metadata(USDT).decimals(), 6);
        ethAmount = 60_000_000; // 60 USDT
        iotaAmount = config.convertERC20ToIOTADecimal(BridgeMessage.USDT, ethAmount);
        assertEq(iotaAmount, ethAmount);

        // BTC
        assertEq(IERC20Metadata(wBTC).decimals(), 8);
        ethAmount = 2_00_000_000; // 2 BTC
        iotaAmount = config.convertERC20ToIOTADecimal(BridgeMessage.BTC, ethAmount);
        assertEq(iotaAmount, ethAmount);
    }

    function testconvertIOTAToERC20Decimal() public {
        // ETH
        assertEq(IERC20Metadata(wETH).decimals(), 18);
        uint64 iotaAmount = 11_000_000_00; // 11 eth
        uint256 ethAmount = config.convertIOTAToERC20Decimal(BridgeMessage.ETH, iotaAmount);
        assertEq(ethAmount, 11 ether);

        // USDC
        assertEq(IERC20Metadata(USDC).decimals(), 6);
        iotaAmount = 50_000_000; // 50 USDC
        ethAmount = config.convertIOTAToERC20Decimal(BridgeMessage.USDC, iotaAmount);
        assertEq(iotaAmount, ethAmount);

        // USDT
        assertEq(IERC20Metadata(USDT).decimals(), 6);
        iotaAmount = 50_000_000; // 50 USDT
        ethAmount = config.convertIOTAToERC20Decimal(BridgeMessage.USDT, iotaAmount);
        assertEq(iotaAmount, ethAmount);

        // BTC
        assertEq(IERC20Metadata(wBTC).decimals(), 8);
        iotaAmount = 3_000_000_00; // 3 BTC
        ethAmount = config.convertIOTAToERC20Decimal(BridgeMessage.BTC, iotaAmount);
        assertEq(iotaAmount, ethAmount);
    }
}
