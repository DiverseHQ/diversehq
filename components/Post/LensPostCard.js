import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

/**
 * Sample post object
 * {
    "__typename": "Post",
    "id": "0x5683-0x1c",
    "profile": {
        "id": "0x5683",
        "name": null,
        "bio": null,
        "attributes": [],
        "isFollowedByMe": false,
        "isFollowing": false,
        "followNftAddress": "0x2aa988BA58F77452242b930F36462D88C3d71c9e",
        "metadata": null,
        "isDefault": true,
        "handle": "daksht.test",
        "picture": null,
        "coverPicture": null,
        "ownedBy": "0xE2C0547Fa4CC1F0242154A93Ade7D744a92a43D7",
        "dispatcher": {
            "address": "0x6C1e1bC39b13f9E0Af9424D76De899203F47755F",
            "canUseRelay": true
        },
        "stats": {
            "totalFollowers": 4,
            "totalFollowing": 7,
            "totalPosts": 21,
            "totalComments": 0,
            "totalMirrors": 0,
            "totalPublications": 21,
            "totalCollects": 9
        },
        "followModule": null,
        "onChainIdentity": {
            "ens": {
                "name": null
            },
            "proofOfHumanity": false,
            "sybilDotOrg": {
                "verified": false,
                "source": {
                    "twitter": {
                        "handle": null
                    }
                }
            },
            "worldcoin": {
                "isHuman": false
            }
        }
    },
    "stats": {
        "totalAmountOfMirrors": 0,
        "totalAmountOfCollects": 2,
        "totalAmountOfComments": 0
    },
    "metadata": {
        "name": "6a7ee164-497d-44cb-bb30-bf4d9b7b4663.png",
        "description": "dragon",
        "content": "dragon",
        "image": "ipfs://bafkreib5blsj4k7tvkrtqo3ixl4i4q6qsjxoxt5vkqkomaknvffiuukooy",
        "media": [
            {
                "original": {
                    "url": "ipfs://bafkreib5blsj4k7tvkrtqo3ixl4i4q6qsjxoxt5vkqkomaknvffiuukooy",
                    "width": null,
                    "height": null,
                    "mimeType": "image/png"
                },
                "small": null,
                "medium": null
            }
        ],
        "attributes": [],
        "encryptionParams": null
    },
    "createdAt": "2022-12-28T11:26:01.000Z",
    "collectModule": {
        "__typename": "FeeCollectModuleSettings",
        "type": "FeeCollectModule",
        "amount": {
            "asset": {
                "name": "Wrapped Matic",
                "symbol": "WMATIC",
                "decimals": 18,
                "address": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
            },
            "value": "0.01"
        },
        "recipient": "0xE2C0547Fa4CC1F0242154A93Ade7D744a92a43D7",
        "referralFee": 0
    },
    "referenceModule": {
        "type": "DegreesOfSeparationReferenceModule",
        "contractAddress": "0xe20D64D25779D2Ae0d76711e5Aca23EE633f2E1E",
        "commentsRestricted": true,
        "mirrorsRestricted": true,
        "degreesOfSeparation": 0
    },
    "appId": "nftornot",
    "hidden": false,
    "reaction": null,
    "mirrors": [],
    "hasCollectedByMe": false,
    "isGated": false
}
 */

const LensPostCard = ({ post }) => {
  return (
    <div style={{ marginTop: '50px' }}>
      <div>
        <ReactTimeAgo date={new Date(post?.createdAt)} locale="en-US" />
      </div>
      <div>Content : {post?.metadata?.content}</div>
      <div>@{post?.profile?.handle}</div>
      <div>Total Comments : {post?.stats?.totalAmountOfComments}</div>
      <div>Upvotes : {post?.stats?.totalUpvotes}</div>
      <div>Downvote : {post?.stats?.totalDownvotes}</div>
    </div>
  )
}

export default LensPostCard
