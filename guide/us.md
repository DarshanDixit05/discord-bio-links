# Guide

This application uses Markdown to handle text formatting.

In this guide, I'll show you the Markdown syntax that's supported on this website and that you can use to make your bios look cooler!

# Headers

You can create a header by starting a new line with `#`, then adding some text.

This will create a header of level 1, which is the biggest.

You can use more `#` to create headers of higher levels which will get smaller and smaller. The smallest one is the header of level 6.

Here's an example with all of the headers.

```
#Very big header
##Big header
###Slightly smaller but still big header
####Even smaller header
#####Smaller header
######Smallest header
```

Which will look like this:

# Very big header
## Big header
### Slightly smaller but still big header
#### Even smaller header
##### Smaller header
###### Smallest header

# Text styling

In Markdown there are 3 different text styles :

- *italic*
- **bold**
- ~~strikethrough~~
  
To write text in italic, simply wrap it around `*`'s, like so: `*this text will be displayed in italic*`.

This displays as: *this text will be displayed in italic*.

Now, for bold text, simply use 2 `*`'s instead of just one.

`**This text is in bold.**.`

Which will look like: **This text is in bold.**

Then, there's also strikethrough text, which you can make by wrapping your text around `~~`.

So, `~~you can't see me!~~` will display as ~~you can't see me!~~

You can also combine each of these (even within headers) to apply multiple styles at once.

For example, ***this is a bold and italic text but I can also be ~~strikthrough~~*** is `***this is a bold and italic text but I can also be ~~strikthrough~~***`.

# Lists
## Unordered lists

You can start an unordered list item by starting a new line by `+`, `*` or `-`, followed by a space and some text. You can build a list by chaining items with a **single** line break.

For example,

- Item 1
- Item 2
- Item 3
  
is written as:

```
- Item 1
- Item 2
- Item 3
```

An item can be multiline.

## Ordered lists
You can also make ordered lists, by starting with a number, followed by a `.`, then a space and some text.

For example, writing

```
1. Hello!
2. I
3. am
4. a
5. list!
```

would result in:

1. Hello!
2. I
3. am
4. a
5. list!

For ordered lists the number that you use doesn't actually matter, it will look the same anyway.

## Task lists

You can create a task list by starting with `+`, `*` or `-`, followed by a space and then

- `[ ]` for an unfinished task
- `[x]` for a finished task

Then some text.

For example,

- [x] This is a task that's done!
- [ ] I should do this one soon!

is written as:

```
- [x] This is a task that's done!
- [ ] I should do this one soon!
```

## Nested lists

All types of lists may be nested by appending 4 spaces before the list sign. You can also nest nested lists (just add 4 spaces for each nesting level).

For example,

- [ ] This is a task with a nested list
    - And this nested list also has a nested list!
        1. I think that's enough nesting!
- [x] This task doesn't have any nesting, but at least, it's done!
  
is written as

```
- [ ] This is a task with a nested list
    - And this nested list also has a nested list!
        1. I think that's enough nesting!
- [x] This task doesn't have any nesting, but at least, it's done!
```

## Please, note
Because of how Markdown is handled on this app, distinct lists **must** be separated by at least 3 line breaks to display correctly.

To be fair, I figured out that there wouldn't be a lot of cases where you would write 2 different consecutive lists, so I didn't bother fixing it.

I *might* (or might not) fix it in the future.

# Horizontal rules

You can create a horizontal rule by writing `***`, `___` or `---` on a line by itself.

They will all result into:

---

# Quoting

You can create quotes by starting a new line with `>` and then adding some text.

Quotes look like this:

> Hi! This is a quote.

For quotes that are longer than a line, you need to add a full line starting with `>` and no other text.

For example, this:

> Fun things are fun.
>
> — Yui Hirasawa

would be written as

```
> Fun things are fun.
>
>  — Yui Hirasawa
```

# Emojis

You to use emoji codes for some emojis.

For example, you could write `:smile:` for 😄.

To see the full list of emojis supported, read the [ShowdownJS documentation](https://github.com/showdownjs/showdown/wiki/Emojis).

# Links

You can create a link by following the `[text](link)` syntax, where text is the text that will be displayed and link is the actual link.

You can also link to specific headers within the page.

To do that you first need to specify an ID for your header with the `{}` syntax.

Simply, write your header as you would, then add a space and curly braces. In the curly braces, with a custom ID for the header.

An example: `# Top of my page {top}`.

**Only use letters and numbers for your custom IDs.**

Then, once it's created, you can use that ID as a link.

I could link to my header with `[Go back to the top](#top)`.

# Code
## Inline code
You can write inline code by wrapping your code between backticks.

For example: <code>\`This is inline code!\`</code> will display as `This is inline code!`.

## Code block
You can open a code snippet block with 3 backticks, a line break, followed by your code, then a line break and finally 3 backticks again.

Which will displays as:

```
console.log("Hello!");
```

# Tables
You can make tables by using `|` and `-`.

For example,

```
| Column 1 | Column 2 |
| -------- | -------- |
| Data 1   | Data 2   |
```

will display as:

| Column 1 | Column 2 |
| -------- | -------- |
| Data 1   | Data 2   |

# Images ?

To prevent things like iplogger images, I disabled them.

# Things are not displaying as expected?

I used a lot of messy workarounds to try and make the Markdown parser work like I wanted it to, so it's sometimes not perfect! If you find that your Markdown isn't being displayed as expected, try adding/removing a few line breaks in between elements of different kinds and see if it works!

If it doesn't, then file an issue and I'll try to fix it! Or, if you found a fix yourself, file a pull request.

*Keep in mind that this project was made for fun and I that don't intend to work on it seriously, so your issue might never be fixed.*
