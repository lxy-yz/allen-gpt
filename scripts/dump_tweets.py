#!/usr/bin/env python
# encoding: utf-8

import tweepy #https://github.com/tweepy/tweepy
import csv

def get_all_tweets_v2(screen_name):
    # Initialize Tweepy with OAuth 2.0
    # TODO: https://developer.twitter.com/en/portal/projects/1725588186829856768/apps/28068801/keys
    client = tweepy.Client(bearer_token="")

    # Initialize a list to hold all tweets
    alltweets = []
    # Get initial batch of tweets (max 100 per request for v2)
    # FIXME: fix 403 Forbidden When authenticating requests to the Twitter API v2 endpoints, you must use keys and tokens from a Twitter developer App that is attached to a Project. You can create a project via the developer portal.
    # upgrade to basic tier $100/m ? https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api
    response = client.get_users_tweets(screen_name, max_results=100)
    alltweets.extend(response.data)
    # Get the ID of the oldest tweet
    oldest_id = alltweets[-1].id

    # Keep fetching tweets until there are no more
    while response.meta['result_count'] > 0:
        print(f"Getting tweets before {oldest_id}")
        response = client.get_users_tweets(screen_name, max_results=100, until_id=oldest_id)
        if not response.data:
            break
        alltweets.extend(response.data)
        oldest_id = alltweets[-1].id
        print(f"...{len(alltweets)} tweets downloaded so far")

    # Transform the tweets into a 2D array for CSV
    outtweets = [[tweet.id, tweet.created_at, tweet.text] for tweet in alltweets]

    # Write the CSV
    with open(f'new_{screen_name}_tweets.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["id", "created_at", "text"])
        writer.writerows(outtweets)

if __name__ == '__main__':
	get_all_tweets_v2("radicalblind")