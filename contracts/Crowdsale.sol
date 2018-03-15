pragma solidity ^0.4.19;
import "./SafeMath.sol";
import "./ERC20Token.sol";

contract Crowdsale {
  using SafeMath for uint256;

  // The token being sold
  ERC20Token public token;

  // Address where funds are collected
  address public wallet;

  // How many token units a buyer gets per wei
  uint256 public rate;

  // Amount of wei raised
  uint256 public weiRaised;

  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
  
  function Crowdsale(uint256 _rate, address _wallet, ERC20Token _token) public {
    require(_rate > 0);
    require(_wallet != address(0));
    require(_token != address(0));

    rate = _rate;
    wallet = _wallet;
    token = _token;
  }

  function buyTokens(address _beneficiary) public payable {
    uint256 weiAmount = msg.value;
    require(_beneficiary != address(0));
    require(weiAmount != 0);

    // calculate token amount to be created
    uint256 tokens = weiAmount.mul(rate);

    weiRaised = weiRaised.add(weiAmount);

    token.mint(_beneficiary, tokens);

    TokenPurchase(msg.sender, _beneficiary, weiAmount, tokens);

    wallet.transfer(weiAmount);
  }

}
