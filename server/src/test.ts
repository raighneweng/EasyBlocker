require("dotenv/config");
var Twitter = require("twitter");

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  //   bearer_token: process.env.TWITTER_BEARER_TOKEN,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const getFollowerList = async function (cursor) {
  const res = await client.get(
    "https://api.twitter.com/1.1/followers/list.json",
    {
      cursor,
    }
  );
  return res;
};

const blockUser = async function (screenName) {
  const res = await client.post(
    "https://api.twitter.com/1.1/blocks/create.json",
    {
      screen_name: screenName,
    }
  );
  return res;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function test(startCursor) {
  try {
    console.log("startCursor:" + startCursor);
    const followerRequest = await getFollowerList(startCursor);

    // console.log("followerRequest:" + JSON.stringify(followerRequest));
    if (followerRequest.users.length === 0) {
      return false;
    }
    let nextCursor = followerRequest.next_cursor;

    for (let user of followerRequest.users) {
      if (!user.following) {
        if (user.protected || user.default_profile_image) {
          // start block user
          console.log(
            "userID: " + user.id + ", screen_name:" + user.screen_name
          );
          const blockRes = await blockUser(user.screen_name);
        }
      }
    }

    await sleep(80000);

    return test(nextCursor);
  } catch (e) {
    console.dir(e);
  }
}

test(1660797824611384000);
