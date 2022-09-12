## How To Contribute

Please note that we have a [code of conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with this project.

Open issues can be found [here](https://gitlab.com/doublegdp/open-platform/-/issues), and we tag issues that are ready to be worked on with the `to do` label. We also tag issues that would make a good first merge request for new contributors with the `good first issue` label.

One way to get started helping the project is to file an issue. You can do that on the [issues page](https://gitlab.com/doublegdp/open-platform/-/issues) by clicking on the "New Issue" button at the right. Issues can include bugs to fix, features to add, or documentation that looks outdated.

Contributions to this project should be made in the form of Gitlab merge requests. When contributing to this repository with a merge request, please fill out the merge request template as completely as is reasonable. Each merge request will be reviewed by a core contributor (someone with permission to merge) and either merged into main or given feedback for requested changes.


## Workflow

When you're ready to start working on an issue:

1. Fork the project and clone it to your local machine. Follow the initial setup [here](DEV_SETUP.md).
2. Visit the [issues page](https://gitlab.com/doublegdp/open-platform/-/issues), take the first issue you are comfortable with, starting from the top. Add a comment that you would like to work on it.
3. Branch from main and, if needed, rebase to the current main branch before submitting your merge request
4. Add tests relevant to the fixed bug or new feature
5. Before you submit a merge or pull request, please ensure that Rubocop, ESLint, and the tests pass - `bin/all.sh`
6. When your code is ready, make a merge request to the main branch of this repository.
7. When you have one approval, one of the admins will merge and add `staging` label to the issue
8. Once the issue is verified on Staging, a `staging verified` label is added. If a bug is noticed during the verification, a `staging bug` label is added with a comment explaining the problem.
