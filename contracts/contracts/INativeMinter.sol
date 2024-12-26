//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
 
interface INativeMinter {
  event NativeCoinMinted(address indexed sender, address indexed recipient, uint256 amount);
  // Mint [amount] number of native coins and send to [addr]
  function mintNativeCoin(address addr, uint256 amount) external;
 
  // IAllowList
  event RoleSet(uint256 indexed role, address indexed account, address indexed sender, uint256 oldRole);
 
  // Set [addr] to have the admin role over the precompile contract.
  function setAdmin(address addr) external;
 
  // Set [addr] to be enabled on the precompile contract.
  function setEnabled(address addr) external;
 
  // Set [addr] to have the manager role over the precompile contract.
  function setManager(address addr) external;
 
  // Set [addr] to have no role for the precompile contract.
  function setNone(address addr) external;
 
  // Read the status of [addr].
  function readAllowList(address addr) external view returns (uint256 role);
}