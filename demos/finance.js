function example () {

  var
    V = envision,
    container = document.getElementById('demo'),                                                                               
    options, vis;                                                                                                                      
                                                                                                                                         
  options = {                                                                                                                          
    container : container,                                                                                                             
    data : {                                                                                                                           
      price : financeData.price,                                                                                                       
      volume : financeData.volume,                                                                                                     
      summary : financeData.price                                                                                                      
    }                                                                                                                                  
  };                                                                                                                                   

  vis = new envision.templates.Finance(options);   
}
