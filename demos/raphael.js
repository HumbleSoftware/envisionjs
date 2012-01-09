function example () {

  var
    r = Raphael("holder"),
    fin = function () {
      this.flag = r.g.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
    },
    fout = function () {
      this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    };

  r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
  r.g.text(300, 10, "Raphael Bars");
  r.g.barchart(0, 0, 600, 240, [[55, 20, 13, 32, 5, 1, 2, 10]]).hover(fin, fout); 

  var
    container = document.getElementById('demo'),
    H = humblevis,
    E = Flotr.EventAdapter,
    data = [],

    flotrOptions = {
      name    : 'flotr-bars',
      height  : 240,
      width   : 600,
      data    : [[1, 55], [2, 20], [3, 13], [4, 32], [5, 5], [6, 1], [7, 2], [8, 10]],
      flotr   : {
        bars : {
          show : true
        },
        title : 'Flotr Bars',
        mouse : {
          track: true,
          trackY: false,
          sensibility: 1,
          trackDecimals: 4,
          relative: true
        },
        yaxis : { 
          noTicks : 3,
          min : 0
        }
      }
    },

    raphaelChild = {
      name    : 'raphael-bars',
      height  : 240,
      width   : 600,
      data    : [
        55, 20, 13, 32, 5, 1, 2, 10
      ],
      raphael : {
        title : 'Raphael Bars',
        bars : true
      }
    },

    vis, price, slider;

  // Application

  vis = new H.Visualization();
  price = new H.Child(flotrOptions);
  //selection = new H.Interaction({leader : anonymousChild});

  vis.add(price);
  vis.render(container);

/*
  selection.add(H.Action.Selection);
  selection.follow(price);
*/

};

