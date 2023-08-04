import { IconAvalanche, IconBNB, IconEthereum, IconPolygon } from "../components/icons/CustomIcons";
import neon1  from '../pages/rewarding-renditions/assets/neondreams/1.png';
import artifacts1  from '../pages/rewarding-renditions/assets/artifacts/1.png';
import creature1  from '../pages/rewarding-renditions/assets/cryptocreatures/1.png';
import celestial1  from '../pages/rewarding-renditions/assets/celestialbeings/1.png';
import nomin1  from '../pages/mushroom-kingdom/assets/cryptocreatures/1.png';
import grutzi1  from '../pages/rewarding-renditions/assets/neondreams/2.png';
import hidoi1  from '../pages/rewarding-renditions/assets/celestialbeings/3.png';
import kaioji1  from '../pages/rewarding-renditions/assets/artifacts/4.png';

export const allbenefits = [
    {
        name: 'Matic Coll',
        contractAddress: '0xD090F5bb1dD329cC857A585CCF5c04Eb9A672cc4',
    },
    {
        name: 'Crypto Creatures', 
        contractAddress : '0x9809abfc4319271259a340775ec03e9746b76068',
        collection: 'rewarding-renditions',
        profileImage: creature1.src,
        chain: 'binance',
        chainIcon: <IconBNB/>,
        currency: 'BNB',
        mintPrice: 0.32,
        totalSize: 5000,
        unlockLevel: 2,
        earnDescription: 'Earn 10% from Direct + 8% from Indirect',
        url: 'crypto_creatures',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct and 8% from second of Loyalty Reward System' },
            { content: '4 Stages of FREE BNB Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'orange',
        picture: 'crypto1',
        phaseDelimiter: 
                    { 
                        phase1 : 625, 
                        phase2: 1250,
                        phase3: 2500,
                        phase4: 5000,
                        phase5: 5000,
                    },
    },
    {
        name: 'Neon Dreams', 
        contractAddress : '0x2945db324Ec216a5D5cEcE8B4D76f042553a213f',
        collection: 'rewarding-renditions',
        profileImage: neon1.src,
        chain: 'binance',
        chainIcon: <IconBNB/>,
        currency: 'BNB',
        mintPrice: 0.64,
        totalSize: 5000,
        unlockLevel: 3,
        earnDescription: 'Earn 10% from Direct + (8% + 6%) from Indirect',
        url: 'neon_dreams',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct, 8% from second and 6% from third level of Loyalty Reward System' },
            { content: '4 Stages of FREE BNB Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'neon',
        picture: 'neon1',
        phaseDelimiter: 
                    { 
                        phase1 : 625, 
                        phase2: 1250,
                        phase3: 2500,
                        phase4: 5000,
                        phase5: 5000,
                    },
    },
    {
        name: 'Celestial Beings', 
        contractAddress : '0x54265672B480fF8893389F2c68caeF29C95c7BE2',
        collection: 'rewarding-renditions',
        profileImage: celestial1.src,
        chain: 'binance',
        chainIcon: <IconBNB/>,
        currency: 'BNB',
        mintPrice: 1.04,
        totalSize: 10000,
        unlockLevel: 4,
        earnDescription: 'Earn 10% from Direct + (8% + 6% + 5%) from Indirect',
        url: 'celestial_beings',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct, 8% from second, 6% from third, and 5% from fourth level of Loyalty Reward System' },
            { content: '4 Stages of FREE BNB Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'flamingo',
        picture: 'celestial1',
        phaseDelimiter: 
                    { 
                        phase1: 1250, 
                        phase2: 2500,
                        phase3: 5000,
                        phase4: 10000,
                        phase5: 10000,
                    },
    },
    {
        name: 'Artifacts of the Future', 
        contractAddress : '0x9BDa42900556fCce5927C1905084C4b3CffB23b0',
        collection: 'rewarding-renditions', 
        profileImage: artifacts1.src,
        chain: 'binance',
        chainIcon: <IconBNB/>,
        currency: 'BNB',
        mintPrice: 1.49,
        totalSize: 20000,
        unlockLevel: 5,
        earnDescription: 'Earn 10% from Direct + (8% + 6% + 5% + 5%) from Indirect',
        url: 'artifacts_of_the_future',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct, 8% from second, 6% from third, 5% from fourth and 5% from fifth level of Loyalty Reward System' },
            { content: '4 Stages of FREE BNB Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'apple',
        picture: 'artifacts1',
        phaseDelimiter: 
                    { 
                        phase1: 2500, 
                        phase2: 5000,
                        phase3: 10000,
                        phase4: 20000,
                        phase5: 20000,
                    },
    },
    {
        name: 'Nomin', 
        contractAddress : '0x05e9d0Fa11eFF24F3c2fB0AcD381B6866CeF2a1C', 
        collection: 'mushroom-kingdom',
        profileImage: nomin1.src,
        chain: 'ethereum',
        chainIcon: <IconEthereum/>,
        currency: 'ETH',
        mintPrice: 0.04,
        totalSize: 5000,
        unlockLevel: 2,
        earnDescription: 'Earn 10% from Direct + 8% from Indirect',
        url: 'nomin',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct and 8% from second of Loyalty Reward System' },
            { content: '4 Stages of FREE ETH Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'orange',
        picture: 'nomin1',
        phaseDelimiter: 
                    { 
                        phase1 : 625, 
                        phase2: 1250,
                        phase3: 2500,
                        phase4: 5000,
                        phase5: 5000,
                    },
    },
    {
        name: 'Grutzi', 
        contractAddress : '0x50Fb365F7B1c5CfaF3a0a9341029ABD0ce8e4f80',
        collection: 'mushroom-kingdom',
        profileImage: grutzi1.src,
        chain: 'ethereum',
        chainIcon: <IconEthereum/>,
        currency: 'ETH',
        mintPrice: 0.08,
        totalSize: 5000,
        unlockLevel: 3,
        earnDescription: 'Earn 10% from Direct + (8% + 6%) from Indirect',
        url: 'grutzi',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct, 8% from second and 6% from third level of Loyalty Reward System' },
            { content: '4 Stages of FREE ETH Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'neon',
        picture: 'grutzi1',
        phaseDelimiter: 
                    { 
                        phase1 : 625, 
                        phase2: 1250,
                        phase3: 2500,
                        phase4: 5000,
                        phase5: 5000,
                    },
    },
    {
        name: 'Hidoi', 
        contractAddress : '0x023803f52a5DD566AC1E6a3B06bCE8CD0d27a8a7',
        collection: 'mushroom-kingdom',
        profileImage: hidoi1.src,
        chain: 'ethereum',
        chainIcon: <IconEthereum/>,
        currency: 'ETH',
        mintPrice: 0.135,
        totalSize: 10000,
        unlockLevel: 4,
        earnDescription: 'Earn 10% from Direct + (8% + 6% + 5%) from Indirect',
        url: 'hidoi',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct, 8% from second, 6% from third, and 5% from fourth level of Loyalty Reward System' },
            { content: '4 Stages of FREE ETH Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'flamingo',
        picture: 'hidoi1',
        phaseDelimiter: 
                    { 
                        phase1: 1250, 
                        phase2: 2500,
                        phase3: 5000,
                        phase4: 10000,
                        phase5: 10000,
                    },
    },
    {
        name: 'Kaioji', 
        contractAddress : '0xa98d96E636123dFB35AB037d1E5a7B76a6e7e95B',
        collection: 'mushroom-kingdom', 
        profileImage: kaioji1.src,
        chain: 'ethereum',
        chainIcon: <IconEthereum/>,
        currency: 'ETH',
        mintPrice: 0.188,
        totalSize: 20000,
        unlockLevel: 5,
        earnDescription: 'Earn 10% from Direct + (8% + 6% + 5% + 5%) from Indirect',
        url: 'kaioji',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct, 8% from second, 6% from third, 5% from fourth and 5% from fifth level of Loyalty Reward System' },
            { content: '4 Stages of FREE ETH Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'apple',
        picture: 'kaioji1',
        phaseDelimiter: 
                    { 
                        phase1: 2500, 
                        phase2: 5000,
                        phase3: 10000,
                        phase4: 20000,
                        phase5: 20000,
                    },
    },
    {
        name: 'Fox', 
        contractAddress : '0xa98d96E636123dFB35AB037d1E5a7B76a6e7e95B',
        collection: 'claws-and-furs', 
        chain: 'polygon',
        chainIcon: <IconPolygon/>,
        currency: 'MATIC',
        mintPrice: 0.188,
        totalSize: 5000,
        unlockLevel: 5,
        earnDescription: 'Earn 10% from Direct + 8% from Indirect',
        url: 'fox',
        benefits: [
            { content: 'Receive 5% Royalty on every resale of this NFT forever' },
            { content: 'Allows you to earn 10% from direct, 8% from second, 6% from third, 5% from fourth and 5% from fifth level of Loyalty Reward System' },
            { content: '4 Stages of FREE ETH Airdrops' },
            { content: '1 stage of FREE Nuva Token Airdrop' }
        ],
        buttonColor: 'orange',
        picture: 'fox',
        phaseDelimiter: 
                    { 
                        phase1: 625, 
                        phase2: 1250,
                        phase3: 2500,
                        phase4: 5000,
                        phase5: 5000,
                    },
    }
];