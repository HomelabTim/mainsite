---
title: "Default Page"
description: ""
tags: ["temp"]
#categories: ["College Projects", "Kasm Projects", "AIMG Projects", "Personal Projects", "AI", "Automation", "File Systems", "General Tech and Knowledge", "Networking and Servers", "Software and Tools", "Tutorials and Guides", "Virtualization", "Web Development"]
date: 2024-03-28
draft: false
showauthor: false
authors:
  - timothysmith
---
```md
{{</* alert */>}}
**Warning!** This action is destructive!
{{</* /alert */>}}
```

{{< alert >}}
**Warning!** This action is destructive!
{{< /alert >}}

**Example 2:** Unnamed param

```md
{{</* alert "twitter" */>}}
Don't forget to [follow me](https://twitter.com/nunocoracao) on Twitter.
{{</* /alert */>}}
```

{{< alert "twitter" >}}
Don't forget to [follow me](https://twitter.com/nunocoracao) on Twitter.
{{< /alert >}}

**Example 3:** Named params

```md
{{</* alert icon="fire" cardColor="#e63946" iconColor="#1d3557" textColor="#f1faee" */>}}
This is an error!
{{</* /alert */>}}
```

{{< alert icon="fire" cardColor="#e63946" iconColor="#1d3557" textColor="#f1faee" >}}
This is an error!
{{< /alert >}}

<br/><br/><br/>

## Article

`Article` will embed a single article into a markdown file. The `link` to the file should be the `.RelPermalink` of the file to be embedded. Note that the shortcode will not display anything if it's referencing it's parent. *Note: if you are running your website in a subfolder like Blowfish (i.e. /blowfish/) please include that path in the link.*

<!-- prettier-ignore-start -->
| Parameter | Description                                              |
| --------- | -------------------------------------------------------- |
| `link`    | **Required.** the `.RelPermalink` to the target article. |
<!-- prettier-ignore-end -->

**Example:**

```md
{{</* article link="/docs/welcome/" */>}}
```

{{< article link="/docs/welcome/" >}}

<br/><br/><br/>

## Badge

`badge` outputs a styled badge component which is useful for displaying metadata.

**Example:**

```md
{{</* badge */>}}
New article!
{{</* /badge */>}}
```

{{< badge >}}
New article!
{{< /badge >}}

<br/><br/><br/>

## Button

`button` outputs a styled button component which can be used to highlight a primary action. It has two optional variables `href` and `target` which can be used to specify the URL and target of the link.

**Example:**

```md
{{</* button href="#button" target="_self" */>}}
Call to action
{{</* /button */>}}
```

{{< button href="#button" target="_self" >}}
Call to action
{{< /button >}}

<br/><br/><br/>

## Carousel

`carousel` is used to showcase multiple images in an interactive and visually appealing way. This allows a user to slide through multiple images while only taking up the vertical space of a single one. All images are displayed using the full width of the parent component and using one of the predefined aspect ratios of `16:9`, `21:9` or `32:9`.

<!-- prettier-ignore-start -->
| Parameter     | Description                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `images`      | **Required.** A regex string to match image names or URLs.                                                        |
| `aspectRatio` | **Optional.** The aspect ratio for the carousel. Either `16-9`, `21-9` or `32-9`. It is set to `16-9` by default. |
| `interval`    | **Optional.** The interval for the auto-scrooling, specified in milliseconds. Defaults to `2000` (2s)             |
<!-- prettier-ignore-end -->

**Example 1:** 16:9 aspect ratio and verbose list of images

```md
{{</* carousel images="{https://cdn.pixabay.com/photo/2016/12/11/12/02/mountains-1899264_960_720.jpg, gallery/03.jpg, gallery/01.jpg, gallery/02.jpg, gallery/04.jpg}" */>}}
```

{{< carousel images="{https://cdn.pixabay.com/photo/2016/12/11/12/02/mountains-1899264_960_720.jpg,gallery/03.jpg,gallery/01.jpg,gallery/02.jpg,gallery/04.jpg}" >}}

**Example 2:** 21:9 aspect ratio and regex-ed list of images

```md
{{</* carousel images="gallery/*" aspectRatio="21-9" interval="2500" */>}}
```

{{< carousel images="gallery/*" aspectRatio="21-9" interval="2500" >}}

<br/><br/><br/>

## Chart

**Example:**

```js
{{</* chart */>}}
type: 'bar',
data: {
  labels: ['Tomato', 'Blueberry', 'Banana', 'Lime', 'Orange'],
  datasets: [{
    label: '# of votes',
    data: [12, 19, 3, 5, 3],
  }]
}
{{</* /chart */>}}
```

<!-- prettier-ignore-start -->
{{< chart >}}
type: 'bar',
data: {
  labels: ['Tomato', 'Blueberry', 'Banana', 'Lime', 'Orange'],
  datasets: [{
    label: '# of votes',
    data: [12, 19, 3, 5, 3],
  }]
}
{{< /chart >}}
<!-- prettier-ignore-end -->

<br/><br/><br/>

## Emoji

**Example:** `see_no_evil` :see_no_evil:, `hear_no_evil` :hear_no_evil:, `speak_no_evil` :speak_no_evil:.

The [Emoji cheat sheet](http://www.emoji-cheat-sheet.com/) is a useful reference for emoji shorthand codes.

<br/><br/><br/>

## Gallery

`gallery` allows you to showcase multiple images at once, in a responsive manner with more varied and interesting layouts.

In order to add images to the gallery, use `img` tags for each image and add `class="grid-wXX"` in order for the gallery to be able to identify the column width for each image. The widths available by default start at 10% and go all the way to 100% in 5% increments. For example, to set the width to 65%, set the class to `grid-w65`. Additionally, widths for 33% and 66% are also available in order to build galleries with 3 cols. You can also leverage tailwind's responsive indicators to have a reponsive grid.

**Example 1: normal gallery**

```md
{{</* gallery */>}}
  <img src="gallery/01.jpg" class="grid-w33" />
  <img src="gallery/02.jpg" class="grid-w33" />
  <img src="gallery/03.jpg" class="grid-w33" />
  <img src="gallery/04.jpg" class="grid-w33" />
  <img src="gallery/05.jpg" class="grid-w33" />
  <img src="gallery/06.jpg" class="grid-w33" />
  <img src="gallery/07.jpg" class="grid-w33" />
{{</* /gallery */>}}
```

{{< gallery >}}
  <img src="gallery/01.jpg" class="grid-w33" />
  <img src="gallery/02.jpg" class="grid-w33" />
  <img src="gallery/03.jpg" class="grid-w33" />
  <img src="gallery/04.jpg" class="grid-w33" />
  <img src="gallery/05.jpg" class="grid-w33" />
  <img src="gallery/06.jpg" class="grid-w33" />
  <img src="gallery/07.jpg" class="grid-w33" />
{{< /gallery >}}

<br/><br/><br/>


**Example 2: responsive gallery**

```md
{{</* gallery */>}}
  <img src="gallery/01.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/02.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/03.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/04.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/05.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/06.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/07.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
{{</* /gallery */>}}
```

{{< gallery >}}
  <img src="gallery/01.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/02.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/03.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/04.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/05.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/06.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="gallery/07.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
{{< /gallery >}}

<br/><br/><br/>

## GitHub Card

`github` allows you to quickly link a github repository, all while showing and updating in realtime stats about it, such as the number of stars and forks it has.

<!-- prettier-ignore-start -->
| Parameter | Description                                           |
| --------- | ----------------------------------------------------- |
| `repo`    | [String] github repo in the format of `username/repo` |
<!-- prettier-ignore-end -->

**Example 1:**

```md
{{</* github repo="nunocoracao/blowfish" */>}}
```

{{< github repo="nunocoracao/blowfish" >}}

<br/><br/><br/>

## GitLab Card

`gitlab` allows you to quickly link a GitLab Project (GitLab's jargon for repo). 
It displays realtime stats about it, such as the number of stars and forks it has.
Unlike `github` it can't display the main programming language of a project.
Finally, custom GitLab instance URL can be provided, as long as the `api/v4/projects/` endpoint is available, making this shortcode compatible with most self-hosted / enterprise deployments.

<!-- prettier-ignore-start -->
| Parameter   | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| `projectID` | [String] gitlab numeric ProjectID                                       |
| `baseURL`   | [String] optional gitlab instance URL, default is `https://gitlab.com/` |
<!-- prettier-ignore-end -->

**Example 1:**

```md
{{</* gitlab projectID="278964" */>}}
```

{{< gitlab projectID="278964" >}}

<br/><br/><br/>

## Icon

`icon` outputs an SVG icon and takes the icon name as its only parameter. The icon is scaled to match the current text size.

**Example:**

```md
{{</* icon "github" */>}}
```

**Output:** {{< icon "github" >}}

Blowfish has built-in support for a number of [FontAwesome 6](https://fontawesome.com/icons) icons. 

| Icon name            | Preview                           |
| -------------------- | --------------------------------- |
| amazon               | {{< icon amazon >}}               |
| apple                | {{< icon apple >}}                |
| bars                 | {{< icon bars >}}                 |
| bell                 | {{< icon bell >}}                 |
| blogger              | {{< icon blogger >}}              |
| bluesky              | {{< icon bluesky >}}              |
| bomb                 | {{< icon bomb >}}                 |
| bug                  | {{< icon bug >}}                  |
| check                | {{< icon check >}}                |
| circle-info          | {{< icon circle-info >}}          |
| code                 | {{< icon code>}}                  |
| codepen              | {{< icon codepen >}}              |
| comment              | {{< icon comment >}}              |
| dev                  | {{< icon dev >}}                  |
| discourse            | {{< icon discourse >}}            |
| docker               | {{< icon docker >}}               |
| download             | {{< icon download >}}             |
| dribbble             | {{< icon dribbble >}}             |
| edit                 | {{< icon edit >}}                 |
| email                | {{< icon email >}}                |
| envelope             | {{< icon envelope >}}             |
| expand               | {{< icon expand >}}               |
| eye                  | {{< icon eye >}}                  |
| facebook             | {{< icon facebook >}}             |
| fire                 | {{< icon fire >}}                 |
| flickr               | {{< icon flickr >}}               |
| fork                 | {{< icon fork >}}                 |
| foursquare           | {{< icon foursquare >}}           |
| ghost                | {{< icon ghost >}}                |
| github               | {{< icon github >}}               |
| gitlab               | {{< icon gitlab >}}               |
| globe                | {{< icon globe >}}                |
| goodreads            | {{< icon goodreads >}}            |
| google               | {{< icon google >}}               |
| graduation-cap       | {{< icon graduation-cap >}}       |
| hackernews           | {{< icon hackernews >}}           |
| hashnode             | {{< icon hashnode >}}             |
| heart-empty          | {{< icon heart-empty >}}          |
| heart                | {{< icon heart >}}                |
| image                | {{< icon image >}}                |
| instagram            | {{< icon instagram >}}            |
| itch-io              | {{< icon itch-io >}}              |
| keybase              | {{< icon keybase >}}              |
| kickstarter          | {{< icon kickstarter >}}          |
| ko-fi                | {{< icon ko-fi >}}                |
| language             | {{< icon language >}}             |
| lastfm               | {{< icon lastfm >}}               |
| lightbulb            | {{< icon lightbulb >}}            |
| link                 | {{< icon link >}}                 |
| linkedin             | {{< icon linkedin >}}             |
| list                 | {{< icon list >}}                 |
| location-dot         | {{< icon location-dot >}}         |
| lock                 | {{< icon lock >}}                 |
| mastodon             | {{< icon mastodon >}}             |
| medium               | {{< icon medium >}}               |
| microsoft            | {{< icon microsoft >}}            |
| moon                 | {{< icon moon >}}                 |
| mug-hot              | {{< icon mug-hot >}}              |
| music                | {{< icon music >}}                |
| orcid                | {{< icon orcid >}}                |
| patreon              | {{< icon patreon >}}              |
| paypal               | {{< icon paypal >}}               |
| pencil               | {{< icon pencil >}}               |
| pgpkey               | {{< icon pgpkey >}}               |
| phone                | {{< icon phone >}}                |
| pinterest            | {{< icon pinterest >}}            |
| poo                  | {{< icon poo >}}                  |
| reddit               | {{< icon reddit >}}               |
| researchgate         | {{< icon researchgate >}}         |
| rss                  | {{< icon rss >}}                  |
| rss-square           | {{< icon rss-square >}}           |
| scale-balanced       | {{< icon scale-balanced >}}       |
| search               | {{< icon search >}}               |
| shield               | {{< icon shield >}}               |
| skull-crossbones     | {{< icon skull-crossbones >}}     |
| slack                | {{< icon slack >}}                |
| snapchat             | {{< icon snapchat >}}             |
| soundcloud           | {{< icon soundcloud >}}           |
| stack-overflow       | {{< icon stack-overflow >}}       |
| star                 | {{< icon star >}}                 |
| steam                | {{< icon steam >}}                |
| stripe               | {{< icon stripe >}}               |
| substack             | {{< icon substack >}}             |
| sun                  | {{< icon sun >}}                  |
| tag                  | {{< icon tag >}}                  |
| telegram             | {{< icon telegram >}}             |
| threads              | {{< icon threads >}}              |
| tiktok               | {{< icon tiktok >}}               |
| triangle-exclamation | {{< icon triangle-exclamation >}} |
| tumblr               | {{< icon tumblr >}}               |
| twitch               | {{< icon twitch >}}               |
| twitter              | {{< icon twitter >}}              |
| wand-magic-sparkles  | {{< icon wand-magic-sparkles >}}  |
| whatsapp             | {{< icon whatsapp >}}             |
| x-twitter            | {{< icon x-twitter >}}            |
| xing                 | {{< icon xing >}}                 |
| xmark                | {{< icon xmark >}}                |
| youtube              | {{< icon youtube >}}              |

<br/><br/><br/>

## Keys

Press <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>DELETE</kbd>
```bash
Press <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>DELETE</kbd>
```
<br/><br/><br/>

## Keyword


The `keyword` component can be used to visually highlight certain important words or phrases, e.g. professional skills etc. The `keywordList` shortcode can be used to group together multiple `keyword` items. Each item can have the following properties.


<!-- prettier-ignore-start -->
| Parameter | Description                             |
| --------- | --------------------------------------- |
| `icon`    | Optional icon to be used in the keyword |
<!-- prettier-ignore-end -->

The input is written in Markdown so you can format it however you please.

**Example1 :**

```md
{{</* keyword */>}} Super skill {{</* /keyword */>}}
```

{{< keyword >}} *Standalone* skill {{< /keyword >}}

**Example2 :**

```md
{{</* keywordList */>}}
{{</* keyword icon="github" */>}} Lorem ipsum dolor. {{</* /keyword */>}}
{{</* keyword icon="code" */>}} **Important** skill {{</* /keyword */>}}
{{</* /keywordList */>}}

{{</* keyword */>}} *Standalone* skill {{</* /keyword */>}}
```

{{< keywordList >}}
{{< keyword icon="github" >}} Lorem ipsum dolor {{< /keyword >}}
{{< keyword icon="code" >}} **Important** skill {{< /keyword >}}
{{< /keywordList >}}
{{< keyword >}} *Standalone* skill {{< /keyword >}}

<br/><br/><br/>

## Lead

`lead` is used to bring emphasis to the start of an article. It can be used to style an introduction, or to call out an important piece of information. Simply wrap any Markdown content in the `lead` shortcode.

**Example:**

```md
{{</* lead */>}}
When life gives you lemons, make lemonade.
{{</* /lead */>}}
```

{{< lead >}}
When life gives you lemons, make lemonade.
{{< /lead >}}

<br/><br/><br/> 

## List

`List` will display a list of recent articles. This shortcode requires a limit value to constraint the list. Additionally, it supports a `where` and a `value` in order to filter articles by their parameters. Note that this shortcode will not display its parent page but it will count for the limit value.

<!-- prettier-ignore-start -->
| Parameter  | Description                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limit`    | **Required.** the number of recent articles to display.                                                                                                 |
| `title`    | Optional title for the list, default is `Recent`                                                                                                        |
| `cardView` | Optional card view enabled for the list, default is `false`                                                                                             |
| `where`    | The variable to be used for the query of articles e.g. `Type`                                                                                           |
| `value`    | The value that will need to match the parameter defined in `where` for the query of articles e.g. for `where` == `Type` a valid value could be `sample` |

{{< alert >}}
The `where` and `value` values are used in the following query `where .Site.RegularPages $where $value` in the code of the shortcode. Check [Hugo docs](https://gohugo.io/variables/page/) to learn more about which parameters are available to use.
{{</ alert >}}

<!-- prettier-ignore-end -->

**Example #1:**

```md
{{</* list limit=2 */>}}
```

{{< list limit=2 >}}

**Example #2:**

```md
{{</* list title="Samples" cardView=true limit=5 where="Type" value="sample" */>}}
```

{{< list title="Samples" cardView=true limit=6 where="Type" value="sample">}}

<br/><br/><br/>

## Swatches

`swatches` outputs a set of up to three different colors to showcase color elements like a color palette. This shortcode takes the `HEX` codes of each color and creates the visual elements for each.

**Example**

```md
{{</* swatches "#64748b" "#3b82f6" "#06b6d4" */>}}
```

**Output**
{{< swatches "#64748b" "#3b82f6" "#06b6d4" >}}

<br/><br/><br/>

## Timeline

The `timeline` creates a visual timeline that can be used in different use-cases, e.g. professional experience, a project's achievements, etc. The `timeline` shortcode relies on the `timelineItem` sub-shortcode to define each item within the main timeline. Each item can have the following properties.


<!-- prettier-ignore-start -->
| Parameter   | Description                                  |
| ----------- | -------------------------------------------- |
| `icon`      | the icon to be used in the timeline visuals. |
| `header`    | header for each entry                        |
| `badge`     | text to place within the top right badge     |
| `subheader` | entry's subheader                            |

<!-- prettier-ignore-end -->

**Example:**

```md
{{</* timeline */>}}

{{</* timelineItem icon="github" header="header" badge="badge test" subheader="subheader" */>}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non magna ex. Donec sollicitudin ut lorem quis lobortis. Nam ac ipsum libero. Sed a ex eget ipsum tincidunt venenatis quis sed nisl. Pellentesque sed urna vel odio consequat tincidunt id ut purus. Nam sollicitudin est sed dui interdum rhoncus. 
{{</* /timelineItem */>}}


{{</* timelineItem icon="code" header="Another Awesome Header" badge="date - present" subheader="Awesome Subheader" */>}}
With html code
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
{{</* /timelineItem */>}}

{{</* timelineItem icon="star" header="Shortcodes" badge="AWESOME" */>}}
With other shortcodes
{{</* gallery */>}}
  <img src="gallery/01.jpg" class="grid-w33" />
  <img src="gallery/02.jpg" class="grid-w33" />
  <img src="gallery/03.jpg" class="grid-w33" />
  <img src="gallery/04.jpg" class="grid-w33" />
  <img src="gallery/05.jpg" class="grid-w33" />
  <img src="gallery/06.jpg" class="grid-w33" />
  <img src="gallery/07.jpg" class="grid-w33" />
{{</* /gallery */>}}
{{</* /timelineItem */>}}

{{</* /timeline */>}}
```


{{< timeline >}}

{{< timelineItem icon="github" header="header" badge="badge test" subheader="subheader" >}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non magna ex. Donec sollicitudin ut lorem quis lobortis. Nam ac ipsum libero. Sed a ex eget ipsum tincidunt venenatis quis sed nisl. Pellentesque sed urna vel odio consequat tincidunt id ut purus. Nam sollicitudin est sed dui interdum rhoncus. 
{{</ timelineItem >}}


{{< timelineItem icon="code" header="Another Awesome Header" badge="date - present" subheader="Awesome Subheader">}}
With html code
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
{{</ timelineItem >}}

{{< timelineItem icon="star" header="Shortcodes" badge="AWESOME" >}}
With other shortcodes
{{< gallery >}}
  <img src="gallery/01.jpg" class="grid-w33" />
  <img src="gallery/02.jpg" class="grid-w33" />
  <img src="gallery/03.jpg" class="grid-w33" />
  <img src="gallery/04.jpg" class="grid-w33" />
  <img src="gallery/05.jpg" class="grid-w33" />
  <img src="gallery/06.jpg" class="grid-w33" />
  <img src="gallery/07.jpg" class="grid-w33" />
{{< /gallery >}}
{{</ timelineItem >}}

{{</ timeline >}}


<br/><br/><br/>

## TypeIt

[TypeIt](https://www.typeitjs.com) is the most versatile JavaScript tool for creating typewriter effects on the planet. With a straightforward configuration, it allows you to type single or multiple strings that break lines, delete & replace each other, and it even handles strings that contain complex HTML.

Blowfish implements a sub-set of TypeIt features using a `shortcode`. Write your text within the `typeit` shortcode and use the following parameters to configure the behavior you want.

<!-- prettier-ignore-start -->
| Parameter          | Description                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tag`              | [String] `html` tag that will be used to render the strings.                                                                                       |
| `classList`        | [String] List of `css` classes to apply to the `html` element.                                                                                     |
| `initialString`    | [String] Initial string that will appear written and will be replaced.                                                                             |
| `speed`            | [number] Typing speed, measured in milliseconds between each step.                                                                                 |
| `lifeLike`         | [boolean] Makes the typing pace irregular, as if a real person is doing it.                                                                        |
| `startDelay`       | [number] The amount of time before the plugin begins typing after being initialized.                                                               |
| `breakLines`       | [boolean] Whether multiple strings are printed on top of each other (true), or if they're deleted and replaced by each other (false).              |
| `waitUntilVisible` | [boolean] Determines if the instance will begin when loaded or only when the target element becomes visible in the viewport. The default is `true` |
| `loop`             | [boolean] Whether your strings will continuously loop after completing                                                                             |

<!-- prettier-ignore-end -->

**Example 1:**

```md
{{</* typeit */>}}
Lorem ipsum dolor sit amet 
{{</* /typeit */>}}
```

{{< typeit >}}
Lorem ipsum dolor sit amet
{{< /typeit >}}

**Example 2:**

```md
{{</* typeit 
  tag=h1
  lifeLike=true
*/>}}
Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. 
{{</* /typeit */>}}
```

{{< typeit
  tag=h1
  lifeLike=true
>}}
Lorem ipsum dolor sit amet,
consectetur adipiscing elit.
{{< /typeit >}}

**Example 3:**

```md
{{</* typeit 
  tag=h3
  speed=50
  breakLines=false
  loop=true
*/>}}
Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. 
{{</* /typeit */>}}
```

{{< typeit
  tag=h3
  speed=50
  breakLines=false
  loop=true
>}}
"Frankly, my dear, I don't give a damn." Gone with the Wind (1939)
"I'm gonna make him an offer he can't refuse." The Godfather (1972)
"Toto, I've a feeling we're not in Kansas anymore." The Wizard of Oz (1939)
{{< /typeit >}}


<br/><br/><br/>

## Youtube Lite

A shortcut to embed youtube videos using the [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed) library. This library is a lightweight alternative to the standard youtube embeds, and it's designed to be faster and more efficient.

<!-- prettier-ignore-start -->
| Parameter | Description                         |
| --------- | ----------------------------------- |
| `id`      | [String] Youtube video id to embed. |
| `label`   | [String] Label for the video        |
<!-- prettier-ignore-end -->

**Example 1:**

```md
{{</* youtubeLite id="SgXhGb-7QbU" label="Blowfish-tools demo" */>}}

```

{{< youtubeLite id="SgXhGb-7QbU" label="Blowfish-tools demo" >}}
