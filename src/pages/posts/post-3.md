---
title: 'A Git Reference Post for Data Analysts'
subtitle: "It's about time I make something I can just link people to"
date: 2024-05-20
author: 'Thomas Lillo'
tags: ["data","learning in public","backends","version control","git"]
layout: ../../layouts/BlogLayout.astro
---

# A Git Reference Post for Data Analysts

In my current role I've been training data analysts to use git so that they can deploy their work with a Azure DevOps pipeline we built for them and after getting a few repeat questions I thought it would be good to put all the basics into a post. 

## What is Version Control (git is a version control program)?

Version control records changes to a file or set of files over time. That's basically all you need to know to understand what and why we do things. 

Everything else is just to support multiple people making and recording changes to files.

This really smart guy who invented Linux also invented git, and you can see all the code here which is cool: https://github.com/git/git/tree/master


## Git: Understanding the Basics

### Setup

Normally as a data analyst you'll just be intereacting with a git repo that some software or IT person has already setup, but you can create your own repo to practise with by following these directions.

With your terminal, go into a folder and use this:

```bash
git init
```

This creates a new repo in the folder that you can interact with.

Otherwise, you'll need to clone a remote repo that your friendly developer or manager can direct you to.


### Getting Your Work into the System

Before you do anything, make sure you pull all the most recent changes that your coworkers have done! This will save you some headache.

```bash
git pull
```

After you've got the most recent versions of all the files and then made your own, you can add all these changes to the repo with this.

```bash
git add .
```

Once you've added your files to the staging area, commit the changes with a descriptive message:

```bash
git commit -m "Your commit message here"
```

Your message should describe what you did, like "fixed my pandas script so report values are not doubled by mistake".

After this you can push your changes to the big repo in the cloud with a similar command to the one we started with:

```bash
git push
```

You can then check the status of your repository to see which files have been modified, staged, or committed:

```bash
git status
```

This should tell you all your changes are synced with the remote repo or you've done something incorrectly.

After you've done some stuff, or to see what others have done, you can review the commit history to see who made changes and when.

```bash
git log
```

## Branching in Git

In the same way that a tree has different branches, so does git!

A good way to think about commits and branches are like a flowing river (the main branch), with small offshoots coming off it (your branches) where different leaves (your work) are falling into it and then eventually joining into the main part of the river.

This is particularly useful for data analysis projects where you may want to experiment with different approaches without affecting the main workflow. 

Create a new branch using:

```bash
git branch <branchname>
```

Switch between branches using:

```bash
git checkout <branchname>
```

Now that you're in the branch you created, you can make changes and commit them like described above.

Once you're done with the changes in your branch, you can merge it back into the main branch using:

```bash
git merge <branchname>
```

After merging, you can delete the branch with:

```bash
git branch -d <branchname>
```

### Made A Mistake? Before You Ask a Developer Check Here:

https://ohshitgit.com/

## Good Sources of Git Knowledge

MIT's Missing Semester:
https://missing.csail.mit.edu/2020/version-control/

A Guide by Roger Dudler
https://rogerdudler.github.io/git-guide/

The Git Docs (somewhat dense probably don't read this too much)
https://git-scm.com/docs

## Learning Git with a Game!

https://learngitbranching.js.org/
