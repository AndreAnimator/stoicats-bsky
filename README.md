# bsky-image-bot [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Build](https://github.com/AndreAnimator/stoicats-bsky/actions/workflows/post-next-image.yml/badge.svg)](https://github.com/AndreAnimator/stoicats-bsky/actions/workflows/post-next-image.yml)

This is a simple bot that posts an image of a cat from the CatsAPI with a stoic quote from stoic quote lambad public API to Bluesky on a cron job using GitHub Actions. Forked and changed from: https://github.com/jasonprado/bsky-image-bot.

## How to use

1. Fork this repo
1. Edit index.ts to customize parsing of your designated quote api into post text. Commit and push.
1. You could also change the at.ts file on the client subfolder to use another image API.
1. Generate an [app password](https://bsky.app/settings/app-passwords) for your Bluesky account.
1. Set Repository Secrets (`github.com/YOUR/REPO/settings/secrets/actions`) `BSKY_IDENTIFIER` and `BSKY_PASSWORD`.
1. Execute the `post-next-image` action from the GitHub UI.
1. When successful, edit `post-next-image.yml` to enable the automated post.
