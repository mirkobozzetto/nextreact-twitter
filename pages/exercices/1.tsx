import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Loader } from '~/components/Loader';
import type { TlTweets } from '~/lib/scheme/tweets';
import TwitterLayout from '../../src/components/TwitterLayout';
import { AddTweetForm } from '../../src/components/tweets/AddTweetForm';
import { LikeButton } from '../../src/components/tweets/LikeButton';
import { RepliesButton } from '../../src/components/tweets/RepliesButton';
import { Tweet } from '../../src/components/tweets/Tweet';

const notifyFailed = () => toast.error("Couldn't fetch tweet...");

const TweetsScheme = z.object({
  tweets: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      createdAt: z.string(),
      user: z.object({
        id: z.string(),
        displayName: z.string(),
        username: z.string(),
        avatarUrl: z.string(),
      }),
      liked: z.boolean(),
      _count: z.object({
        likes: z.number(),
        replies: z.number(),
      }),
    })
  ),
});

const getTweets = async (signal: AbortSignal) =>
  fetch(`/api/tweets`, { signal })
    .then((res) => res.json())
    .then((data) => TweetsScheme.parse(data));

export default function FetchAllTweets(props) {
  const [tweets, setTweets] = useState<TlTweets | null>();

  useEffect(() => {
    const abortController = new AbortController();

    getTweets(abortController.signal)
      .then((data) => {
        setTweets(data.tweets);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;

        notifyFailed();
        setTweets([]);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  if (!tweets) return <Loader />;

  return (
    <TwitterLayout>
      <AddTweetForm />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet}>
          <RepliesButton count={tweet._count.replies} />
          <LikeButton count={tweet._count.likes} liked={tweet.liked} />
        </Tweet>
      ))}
    </TwitterLayout>
  );
}
