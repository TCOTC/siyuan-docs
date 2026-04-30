---
source_url: https://www.writethedocs.org/tools/
source_file: docs/guide/tools/index.rst
license: CC BY-NC-SA 4.0
---

<!-- 正文合并自 docs/guide/tools/sphinx.rst、sphinx-themes.rst、sphinx-community.rst、testing.rst。 -->

# Tools for documentation writing

Writing documentation requires good tools. This section covers documentation tools recommended by the Write the Docs community, with a focus on tools widely used for technical documentation.

## Sphinx

### Introduction to Sphinx

## Philosophy

[Sphinx](http://sphinx-doc.org/) is what is called a documentation generator.
This means that it takes a bunch of source files in plain text,
and generates a bunch of other awesome things, mainly HTML.
For our use case you can think of it as a program that takes in plain text
files in [reStructuredText](#restructuredtext) format, and outputs HTML.

    reST -> Sphinx -> HTML

So as a user of Sphinx, your main job will be writing these text files.
This means that you should be minimally familiar with [reStructuredText](#restructuredtext) as
a language.
It's similar to Markdown in a lot of ways.
It's a lot more powerful than Markdown,
but with that power comes increased
complexity.
Just know that some of the awkward syntax allows you to do more interesting
things further down the line.
In particular, it is extensible: it has a formal way of adding markup
[directives](http://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html#) that allow more sophisticated parsing.
For example, Sphinx includes directives to relate documentation of
modules, classes and methods to the corresponding code.

## Installing Sphinx

The first step to getting going is installing [Sphinx](http://sphinx-doc.org/).
Sphinx is a Python project, so it can be installed like any other Python library.
Several Operating Systems (Mac OS X, Major Versions of Linux/BSD) have Python pre-installed,
so you should just have to run:

    sudo pip install Sphinx

Instructions for installing Python and Sphinx on Windows can be found at the [Sphinx install page](http://sphinx-doc.org/install.html).

> [!NOTE]
> Advanced users can install this in a virtualenv if they wish.

## Getting started

You'll want to read the [Sphinx Getting Started guide](http://www.sphinx-doc.org/en/master/usage/quickstart.html),
as it provides an introduction to a lot of the basic ideas. If you use
the `sphinx-quickstart` tool described there, it'll create
a sample project with the following standard structure:

    project/
        docs/
            conf.py
            index.rst
            Makefile

We have a top-level `docs` directory in the main project directory.
Inside of this is:

`index.rst`:  
This is the index file for the documentation, or what lives at `/`.
It can be thought of as a landing page that contains child topics
for users to navigate to. It normally contains a [table of
contents](http://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html#table-of-contents) that will link other topics in the documentation.

`conf.py`: which allows for customization of the output.  
For the most part this shouldn't need to be changed.

`Makefile`: This ships with sphinx,  
and is the main interface for local development,
but shouldn't be changed.

Other `*.rst` files for specific subsections of documentation.

## Table of contents structure

The method for specifying a table of contents (TOC) structure in
Sphinx is somewhat unusual. Instead of a master file that contains the
hierarchical structure of the TOC for the whole project, you'll need
to include [toctree directives](http://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html#table-of-contents) in each parent topic that has child
topics. Sphinx will then infer the overall TOC structure from the `toctree`
directives in individual files.

For example, the `index.rst` file in your project folder may contain
the following toctree directive:

    .. toctree::

       TopLevel1
       TopLevel2

This indicates that there are two top-level topics. If you want the
`TopLevel1` topic to contain child topics, then you'd insert the
following `toctree` directive in TopLevel1:

    .. toctree::

       Child1
       Child2
       Child3

Different Sphinx themes will have different ways of displaying the TOC
in the sidebar. You can also configure whether or not to display the
toctree directive as a mini-toc within the topic itself, by adding a
`:hidden:` option to the `toctree` directive.

## Writing docs

Where you write your documentation will vary based on how the project is
laid out.
Generally major topics will go in an aptly named file in the
top-level docs directory.
If a topic gets larger, it can then be broken out into multiple files in a
directory.
When you write a document, figure out if there is already a place for it in
the project, otherwise feel free to start a new file.

> [!WARNING]
> If you make a new file, make sure it is included in a
> `toctree` directive in a file that is in the TOC. When
> you build the documentation, Sphinx will display a
> warning for each document that isn't in the TOC.

### reStructuredText

To write nice looking documentation you will need to have a basic
understanding of RST as a language.
The [reStructuredText Primer](http://sphinx.pocoo.org/rest.html#rst-primer) is a great place to start reading, and it
covers most of the syntax you will care about.
The main parts you will need at first are:

- **Inline Markup**
- **Source Code**
- **Hyperlinks**
- **Sections**
- **Directives**

> [!NOTE]
> You can live-preview RST on the web: <http://rst.ninjs.org/>
> . Note that it won't understand Sphinx-specific markup though.

Feel free to play around with RST a bit to make sure that you understand how
it works.

> [!WARNING]
> RST is white-space sensitive in places.
> If it is acting weirdly, make sure you indent lines that are part of the
> same content similarly.

## Building docs

Once you have your documentation written and want to turn it into HTML,
it's pretty simple. Simply run:

    # Inside top-level docs/ directory.
    make html

This should run Sphinx in your shell, and output HTML.
At the end, it should say something about the documents being ready in
`_build/html`.
You can now open them in your browser by typing:

    open _build/html/index.html

## Markdown support

While Sphinx primarily uses reStructuredText, it can also work with Markdown files using the MyST Parser. MyST (Markedly Structured Text) extends CommonMark Markdown with features needed for technical documentation while maintaining compatibility with Sphinx's ecosystem.

To use Markdown in your Sphinx project, install myst-parser and configure it in `conf.py`. You can mix `.rst` and `.md` files in the same project.

- [MyST Parser documentation](https://myst-parser.readthedocs.io/)

## Key features and extensions

Sphinx includes powerful features for technical documentation:

**Intersphinx**: Cross-reference documentation from other Sphinx projects without duplicating content. Particularly valuable for projects with multiple interconnected documentation sites.

- [Intersphinx documentation](https://www.sphinx-doc.org/en/master/usage/extensions/intersphinx.html)

**Domains**: Built-in support for documenting Python, C, C++, JavaScript, and reStructuredText code with specialized directives and roles. Extensions available for other languages.

**Extensions ecosystem**: Large collection of extensions for specialized needs (autodoc, viewcode, todo, napoleon, and many more).

- [Extensions documentation](https://www.sphinx-doc.org/en/master/usage/extensions/index.html)


---

## Sphinx themes

These are Sphinx themes that the Write the Docs community recommends.
The Sphinx ecosystem includes many themes - this list highlights popular, well-maintained options.
If there are others you like, feel free to open a pull request to add them.

Requirements to be included on this list:

- Mobile Ready
- Nice fonts and typography
- Installable as a Python module
- Maintained and documented

## Read the Docs theme

The official theme for Read the Docs.
It features beautiful typography and a nice blue color scheme.
It looks great on mobile,
and provides a menu of all the pages on the left-hand side.

- <https://github.com/snide/sphinx_rtd_theme>

<img src="https://www.writethedocs.org/_static/img/rtd.png" style="width:80.0%" alt="image" />

## Alabaster

Based off the original Flask and KR themes,
this is a more extensible version of the prior.
It is what this site uses,
and provides very minimal markup.
It's great for text content where you just want to make the words front and center.

- <https://github.com/bitprophet/alabaster>

<img src="https://www.writethedocs.org/_static/img/paramiko.png" style="width:80.0%" alt="image" />

## Sphinx Bootstrap theme

A basic Sphinx theme that uses Bootstrap for nice styling.
It is a great start for any site that uses Bootstrap,
or just wants a simple good looking theme.

- <https://github.com/ryan-roemer/sphinx-bootstrap-theme>

<img src="https://www.writethedocs.org/_static/img/bootstrap.png" style="width:80.0%" alt="image" />

## Guzzle theme

Originally built for Guzzle (PHP HTTP client), this theme is another
mobile friendly alternative with nice colors.

- <https://github.com/guzzle/guzzle_sphinx_theme>

<img src="https://www.writethedocs.org/_static/img/guzzle.png" style="width:80.0%" alt="image" />

## Documatt theme

Mobile friendly Sphinx theme designed to provide great documentation reading experience with beautiful typography.

This theme is default theme of Documatt Techwriter at work blog but you are welcome to use it with any Sphinx project.

- <https://pypi.org/project/sphinx-documatt-theme/>

<img src="https://www.writethedocs.org/_static/img/documatt.png" style="width:80.0%" alt="image" />

## Furo theme

Originally built for the pip documentation, this mobile friendly theme is minimal but customizable and has carefully
designed navigation features (sidebar, inter-page links).

- <https://github.com/pradyunsg/furo>

<img src="https://www.writethedocs.org/_static/img/furo.png" style="width:80.0%" alt="image" />

## PyData Sphinx theme

A clean, three-column, Bootstrap-based theme widely adopted by scientific and data science projects. Features responsive design and excellent navigation for complex documentation.

- <https://github.com/pydata/pydata-sphinx-theme>

## Shibuya

A modern, responsive theme with excellent light/dark mode support and great integration with Jupyter extensions. Features Radix color system and flexible layouts.

- <https://github.com/lepture/shibuya>

## Clarity theme

A clean and professional documentation theme for Sphinx. Modern design with light/dark mode, responsive layout, and beautiful typography.

- <https://readcraft.io/sphinx-clarity-theme>

<img src="https://www.writethedocs.org/_static/img/clarity-theme.png" style="width:80.0%" alt="image" />


---

## Sphinx community

# Community perspectives on Sphinx

This page captures common experiences and feedback from the Write the Docs community about using Sphinx, based on discussions at Write the Docs Portland 2021 and ongoing community conversations.

## What users appreciate

Community members frequently highlight Sphinx's strengths for technical documentation:

- Code introspection and tight integration with source code (docs-as-code approach)
- Powerful reStructuredText markup for complex documentation needs
- Intersphinx for cross-linking between projects
- Strong domain support for multiple programming languages

## Common challenges

New users often encounter similar hurdles when learning Sphinx:

**Learning curve**: Sphinx presents a significant barrier to entry, particularly for those new to documentation tools or reStructuredText.

**Navigation setup**: Creating and managing toctree structures requires careful planning and can be unintuitive initially.

**Documentation style**: The official Sphinx documentation is comprehensive but geared toward reference rather than learning. New users often benefit from supplementary tutorials like those in the [Sphinx introduction](#introduction-to-sphinx).

**Theming**: Customizing Sphinx themes requires understanding the templating system, which can be challenging. The [Sphinx themes](#sphinx-themes) section provides recommended starting points.

## Resources and community

The Sphinx community continues to create learning resources to address the steep learning curve:

- [Sphinx Tutorial](https://www.sphinx-doc.org/en/master/tutorial/) - Official tutorial for newcomers
- [Read the Docs Getting Started](https://docs.readthedocs.io/en/stable/intro/getting-started-with-sphinx.html) - Step-by-step guide

Join the \#sphinx channel on the Write the Docs Slack to connect with other Sphinx users and get help.

---

## Other documentation tools

While this section currently focuses on Sphinx, the Write the Docs community uses many documentation tools depending on project needs:

- **MkDocs**: Markdown-focused static site generator with live preview
- **Docusaurus**: React-based tool by Meta with built-in versioning and i18n
- **Jekyll**: Ruby-based static site generator, popular for GitHub Pages
- **Hugo**: Extremely fast Go-based generator for content sites

See the main [Software documentation guide](../software-documentation-guide.md) for broader documentation guidance applicable across tools.

## Testing and quality

### Testing your documentation

Testing your documentation allows you to make sure it is in a consistent state.
Doing this gives your users a better experience,
and reduces stress around common issues as a writer.

This [article](https://opensource.com/business/15/7/continuous-integration-and-continuous-delivery-documentation) by Anne Gentle is a good place to start to understand this concept.

## Continuous integration

The most useful tests are run on each commit of your project.
This is called **Continuous Integration**,
and is a common practice in the software development world.

We recommend checking out the following tools to get started:

- [Travis CI](https://travis-ci.org) (GitHub only, free for open source)
- [AppVeyor](https://www.appveyor.com/) (Windows support, free for open source)

## Build errors

The easiest automated check to do is to make sure your documentation builds
properly. This requires simply running your documentation tool, and checking
that it has properly built your documentation.

Most tools will return an *error code* of 0 if the process is successful. This
means you should just be able to do a normal build of your tool, and your
testing tool will know if it is successful or not.

If your build tool has a *picky* mode that flags warnings that *might* be
problematic as well as errors, it might make sense to switch it on, but you'll
want to make sure that your documentation is in good shape before you do.

- Sphinx has [nitpicky mode](https://www.sphinx-doc.org/en/stable/config.html#confval-nitpicky).
- Jekyll has [strict mode](https://jekyllrb.com/docs/configuration/#liquid-options).

## Link testing

Making sure all the hyperlinks in your docs are working is a really great place to start.
This makes sure your users don't hit dead ends,
and is quite simple in terms of automation.

You can either:

- Use a tool provided with your documentation tools
- Treat your rendered documentation as a normal website, and use a website link checker

These are the tools we know with proper link checking:

### Sphinx

Sphinx ships with a `linkcheck` [builder](https://www.sphinx-doc.org/en/stable/builders.html) as a default.
You can run it with a simple:

    make linkcheck

Its output looks something like this:

![Sphinx linkcheck screenshot](https://www.writethedocs.org/_static/img/guide/sphinx-linkcheck.png)

### Jekyll

Jekyll has a few plugins that support link checking:

- <https://github.com/endymion/link-checker>

### HTMLProofer

[HTMLProofer](https://github.com/gjtorikian/html-proofer) checks links in
HTML, as well as images, titles and tag validity.

## Style guide checking and linting

Linters are tools that automatically verify specific rules against your code or
documentation. This is useful for enforcing a style guide, or for catching
commonly mistaken branding issues.

Here are a few links that might be interesting:

- <https://blog.mapbox.com/regulating-english-with-retext-mapbox-standard-d79a8158f251>
- <https://krausefx.com/blog/writing-automated-tests-for-your-documentation>

## Vale

Vale is a syntax-aware linter for prose built for speed and extensibility.

<https://github.com/errata-ai/vale>

You can use the following styles with Vale, although as of v2.0.0, Vale no longer includes these styles by default:

- [Proselint](https://github.com/amperser/proselint)
- [Write-good](https://github.com/btford/write-good)
- [Joblint](https://github.com/rowanmanning/joblint)

You can also use an implementation of both the Microsoft Writing Style Guide and the Google Developer Documentation Style Guide with Vale. You can find these styles in the following repository: <https://github.com/errata-ai/styles>.

To configure Vale, follow the instructions in the README. If needed, install
the *vale* binary as an executable in your \$PATH, so you can run *vale* directly
from the command line. For example, on UNIX/Linux systems, you can copy vale
to the /usr/local/bin directory.

After installing Vale, run the following commands to check for proper installation:

\$ <span class="title-ref">vale</span>

\$ <span class="title-ref">vale dc</span>

If you see empty JSON in the output to the second command, you've successfully
installed Vale.

Now to configure Vale, you'll need a .vale or a .vale.ini configuration file. For some
examples, see

- <https://github.com/writethedocs/www/blob/master/.vale.ini>
- <https://github.com/cockroachdb/docs/blob/master/.vale.ini>
- <https://github.com/linode/docs/blob/develop/.vale.ini>

While it's possible to install the Vale configuration file in different locations,
it may be most convenient to install it in the root directory of your target
repository, as shown in the noted examples.

Once configured for your repository, you should be able to navigate to your
repository path, and then run <span class="title-ref">vale dc</span> to confirm your configuration.

You can then apply Vale as a grammar linter directly to your source files, with
a command like:

\$ <span class="title-ref">vale /path/to/someText.md</span>

Hint: Vale even works with XML files, such as those in DocBook and DITA, as long
as you've included <span class="title-ref">\*.xml</span> in the Vale configuration file.
