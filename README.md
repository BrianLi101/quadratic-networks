# Quadratic Networks

## Introduction
Quadratic Networks is an innovative approach to manage group memberships in a decentralized and scalable way. This project aims to address common issues in traditional membership systems, such as centralized decision-making and susceptibility to single points of failure. By leveraging blockchain technology, Quadratic Networks provides a robust solution for maintaining the culture and vibe of a group as it grows.

## Problem Statement
- **Centralized Decision Making**: Traditional membership systems often rely on a centralized authority, making them vulnerable to biased or unfair decision-making.
- **Off-Chain Admin Mechanisms**: Many existing solutions depend on off-chain administration, exposing them to risks of single points of failure.
- **Scalability vs Culture**: As networks grow, maintaining the original culture and vibe becomes increasingly challenging.

## Proposal: Quadratic Networks
Quadratic Networks introduces a fully on-chain membership system that addresses these issues through the following features:
- **On-Chain Data Management**: Eliminates off-chain points of failure and removes centralized admin control.
- **Cultural Preservation**: Ensures the group's vibe and culture are maintained even as the network scales.
- **Decentralized Membership Acceptance**: Membership decisions are made transparent and are open to all current members, promoting fairness and inclusivity.
- **Controlled Growth**: Implements mechanisms to manage the pace of network expansion effectively.

## How It Works

### Starting a New Network
1. **Initial Seeding**: Three initial members seed a new Quadratic Network. An optional network ceiling (e.g., 100 members) can be set.
   
### Growing the Network
1. **Member Nominations**: Existing members nominate new members.
2. **Acceptance Criteria**: New members require \(\sqrt{n}\) nominations for acceptance, where \(n\) is the current number of members.

## Future Work
- **Quadratic Network Trimming**: Refining the network to ensure quality and relevance of the membership.
- **Privacy Preserving Implementations**: Exploring the use of Zero-Knowledge Proofs (ZK) for enhancing privacy without compromising the integrity of the network.
- **Removal Criteria**: allow existing members to remove members through an anonymous nomination process, starting with a function similar to the acceptance criteria.
- **Alternative Membership Curation Functions**: Allow the use of other functions as acceptance and removal criteria.

## Contributing
We welcome contributions from the community. Please refer to our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.

## License
This project is licensed under the [MIT License](LICENSE).
