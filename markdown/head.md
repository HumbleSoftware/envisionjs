# Envision.js
-------------

Fast interactive HTML5 charts.

![Google Groups](http://groups.google.com/intl/en/images/logos/groups_logo_sm.gif)

http://groups.google.com/group/envisionjs/

## Features

* Modern Browsers, IE 6+
* Mobile / Touch Support
* Pre-built Templates
* Adaptable to Existing Libraries

## Dependencies

Envision.js ships with all it's dependencies.  It uses:

* <a href="http://documentcloud.github.com/underscore/">underscore.js</a>
* <a href="https://github.com/fat/bean">bean</a>
* <a href="https://github.com/ded/bonzo">bonzo</a>
* <a href="http://humblesoftware.com/flotr2/">Flotr2</a>

## Usage

To use Envision.js, include `envision.min.js` and `envision.min.css` in your
page. To display a visualization, either use a Template or create a custom
visualization with the Envision.js API.

### Templates

Templates are pre-built visualizations for common use-cases.

Example: 

```javascript
  var
    container = document.getElementById('container'),
    x = [],
    y1 = [],
    y2 = [],
    data, options, i;

  // Data Format:
  data = [
    [x, y1], // First Series
    [x, y2]  // Second Series
  ];

  // Sample the sine function for data
  for (i = 0; i < 4 * Math.PI; i += 0.05) {
    x.push(i);
    y1.push(Math.sin(i));
    y2.push(Math.sin(i + Math.PI));
  }

  // TimeSeries Template Options
  options = {
    // Container to render inside of
    container : container,
    // Data for detail (top chart) and summary (bottom chart)
    data : {
      detail : data,
      summary : data
    }
  };

  // Create the TimeSeries
  new envision.templates.TimeSeries(options);
```

### Custom

Developers can use the envision APIs to build custom visualizations.  The
existing templates are a good reference for this.

Example: 

```javascript
  var
    container = document.getElementById('container'),
    x = [],
    y1 = [],
    y2 = [],
    data, i,
    detail, detailOptions,
    summary, summaryOptions,
    vis, selection,

  // Data Format:
  data = [
    [x, y1], // First Series
    [x, y2]  // Second Series
  ];

  // Sample the sine function for data
  for (i = 0; i < 4 * Math.PI; i += 0.05) {
    x.push(i);
    y1.push(Math.sin(i));
    y2.push(Math.sin(i + Math.PI));
  }
  x.push(4 * Math.PI)
  y1.push(Math.sin(4 * Math.PI));
  y2.push(Math.sin(4 * Math.PI));

  // Configuration for detail:
  detailOptions = {
    name : 'detail',
    data : data,
    height : 150,
    flotr : {
      yaxis : {
        min : -1.1,
        max : 1.1
      }
    }
  };

  // Configuration for summary:
  summaryOptions = {
    name : 'summary',
    data : data,
    height : 150,
    flotr : {
      yaxis : {
        min : -1.1,
        max : 1.1
      },
      selection : {
        mode : 'x'
      }
    }
  };

  // Building a custom vis:
  vis = new envision.Visualization();
  detail = new envision.Component(detailOptions);
  summary = new envision.Component(summaryOptions);
  interaction = new envision.Interaction();

  // Render Visualization
  vis
    .add(detail)
    .add(summary)
    .render(container);

  // Wireup Interaction
  interaction
    .leader(summary)
    .follower(detail)
    .add(envision.actions.selection);
```

## API

