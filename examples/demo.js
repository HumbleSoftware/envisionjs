
Event.observe(document, 'dom:loaded', function() {

    HumbleFinance.trackFormatter = function (obj) {
        
        var x = Math.floor(obj.x);
        var data = jsonData[x];
        var text = data.date + " Price: " + data.close + " Vol: " + data.volume;
        
        return text;
    };
    
    HumbleFinance.yTickFormatter = function (n) {
        
        if (n == this.max) {
            return false;
        }
        
        return '$'+n;
    };
    
    HumbleFinance.xTickFormatter = function (n) { 
        
	n = parseInt(n);
	
        if (n == 0) {
            return false;
        }
        
        var date = jsonData[n].date;
        date = date.split(' ');
        date = date[2];
        
        return date; 
    };
    
    HumbleFinance.init('humblefinance', priceData, volumeData, summaryData);
    HumbleFinance.setFlags(flagData);
});
