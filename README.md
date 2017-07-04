# Emondo Front-end Web App

## Requirements
* node `^4.2.0`
* npm `^3.0.0`

## Setup

1. `git clone git@bitbucket.org:lihan/emondo-fe.git emondo-fe`
2. `cd emondo-fe && npm install`
3. `npm start`
4. <http://localhost:3000>

## Deploy

1. `npm run compile`

## Stack

1. Based on [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit).
2. [React](https://facebook.github.io/react/)
3. [Redux](https://github.com/reactjs/redux)
4. [React Router](https://github.com/reactjs/react-router)
5. [Bootstrap](https://react-bootstrap.github.io/)
6. [lodash](https://lodash.com)
7. [webpack](https://webpack.github.io/)

## Guidelines (draft)

1. Immutable data everywhere. Use `const` for all definitions; avoid using `var` and `let`.
2. Use `isRequired` in `propTypes` for props that **should** be present.
3. Use [react-bootstrap](https://react-bootstrap.github.io/) components wherever possible instead of raw HTML tags with Boostrap classes.
4. No `id` attributes.
5. Use camelCase when naming CSS classes. Combine multiple classes with [classNames](https://github.com/JedWatson/classnames).
6. No nesting of CSS rules, unless you have to use a `:global` selector. Use a separate className-rule instead.
7. No CSS rules duplication. If a certain group of rules is used in multiple places, extract into a SASS mixin, or write a separate component that encapsulates the styling, and re-use it where needed.
8. Avoid the use of `:global` selectors as much as possible.
9. ESLint your code before merging and make sure there are no lint errors or warnings.
10. Keep lines length under 120 chars.

## Git guidelines

**Step 1**: Assuming you are working on `new-feature`, create a new branch:

```
git checkout master
git checkout -b new-feature
```

You can also create a new branch from bitbucket and sync with your local repo:
```
git fetch && git checkout new-feature
```

**Step 2**: Make your changes and, ideally, squash all your commits into a single commit. Assuming you made 5 commits:

```
git rebase -i HEAD~5
```

Follow the guide to squash your commits into a single commit. If needed, enter a multi-line commit message, for example:

```
Implement new feature - `new-feature`
* Use react-modal
* Use /api/forms API endpoint
* Add <Spinner /> for indicating pending request
```
Force-push your commits
```
git push --force
```

**Step 3**: Finally to merge your branch back to master and push to remote, do the following:

```
git checkout master
git pull origin master
git checkout new-feature
git rebase master
git checkout master
git merge --no-ff new-feature
git push origin master
```

You can also merge the branches on bitbucket and then sync with your local repo for later use.
