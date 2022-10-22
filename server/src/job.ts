require('dotenv/config');
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const getFollowerList = async function (cursor: number) {
    const res = await client.get('https://api.twitter.com/1.1/followers/list.json', {
        cursor,
    });
    return res;
};

const blockUser = async function (screenName: string) {
    const res = await client.post('https://api.twitter.com/1.1/blocks/create.json', {
        screen_name: screenName,
    });
    return res;
};

const removeFollow = async function (userId: string) {
    const res = await client.post('https://api.twitter.com/1.1/friendships/destroy.json', {
        user_id: userId,
    });
    return res;
};

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function startBlock(startCursor: number): Promise<any> {
    try {
        console.log('startCursor:' + startCursor);
        const followerRequest = await getFollowerList(startCursor);

        // console.log("followerRequest:" + JSON.stringify(followerRequest));
        if (followerRequest.users.length === 0) {
            return false;
        }
        let nextCursor = followerRequest.next_cursor;

        for (let user of followerRequest.users) {
            // console.log(JSON.stringify(user));
            if (!user.following) {
                if (
                    user.protected ||
                    user.default_profile_image ||
                    user.followers_count * 80 < user.friends_count ||
                    user.statuses_count == 0
                ) {
                    // start block user
                    console.log('userID: ' + user.id + ', screen_name:' + user.screen_name);
                    // const blockRes = await blockUser(user.screen_name);
                    await removeFollow(user.id);
                }
            }
        }

        await sleep(80000);

        return startBlock(nextCursor);
    } catch (e) {
        console.dir(e);
    }
}

startBlock(-1);
