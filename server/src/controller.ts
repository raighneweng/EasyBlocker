import Twitter from 'twitter';

export const createToken = async (ctx: any, next: Function) => {
    try {
        var client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            bearer_token: process.env.TWITTER_BEARER_TOKEN,
        });

        const res = await client.post('https://api.twitter.com/oauth/request_token', {
            oauth_callback: 'http://easyblocker.raighne.xyz',
        });

        console.log(res);
    } catch (e) {
        console.log(e.msg);
    }
};
