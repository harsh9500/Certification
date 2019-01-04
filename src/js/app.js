App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  fhash:" ",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {

    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Certificate.json", function(certificate) {
      
      App.contracts.Certificate = TruffleContract(certificate);
      
      App.contracts.Certificate.setProvider(App.web3Provider);
      console.log(App.contracts.Certificate)
      //App.listenForEvents();

      return App.render();
    });
  },

  
  listenForEvents: function() {
    App.contracts.Certificate.deployed().then(function(instance) {
      // Restart Chrome if unable to receive this event
      instance.hashcalculated({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
  },


  display:function(c,add){

    App.contracts.Certificate.deployed().then(function(instance) {
      Instance=instance;
      var Results = $("#Results");
      var Template="";
    for(var k=0;k<c;k++)
    {
            
            
            Instance.certificates(add,k).then(function(arr){
              
            Template= "<tr><th>" + arr[0] + "</th><td>"; 
            Template+= arr[1] + "</td></tr>";
            
            Results.append(Template);
      })
    }
    
})
  },

  readFile: function(){
    var certi;
    if (this.files && this.files[0]) {
        
        var FR= new FileReader();
        
        FR.onload = function(e) {

          $('#img').attr('src', e.target.result);
          $("#b64").html(e.target.result);
          certi=e.target.result;
          certi.toString()
         
          var hash = 0, i, chr;
    
        for (i = 0; i < certi.length; i++) {
      chr   = certi.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; 
    }

      
      $("#string_hash").html(hash.toString()); 
        } 
  
        FR.readAsDataURL( this.files[0] );
      }
    
  },

  render: function() {
    var Instance;
    var loader = $("#loader");
    var content = $("#content");
    
    loader.show();
    content.hide();


  $("#inp").on("change", App.readFile);

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Certificate.deployed().then(function(instance) {
      
      Instance = instance;
      
      return Instance.personcount();

    }).then(function(Count){
      
      var Results = $("#Results");
      Results.empty(); 

      for (var i = 1; i <= Count ; i++) {
        var c;
        var add;
        var k;
        var Template = "";

        Instance.Persons(i).then(function(result){
                 
            add=(result[0]);
            c=(result[1]["c"][0]);
            App.display(c,add);    
              
        })

          
        } 
      
      });
  
      loader.hide();
      content.show();
   },


      hash:function(){
        
      var certi;

      console.log($("#b64").text());
      certi=$("#b64").text();
      addr=$("#address").val();
      pk=$("#pk").val();
      string_hash=$("#string_hash").text().toString();
      console.log(certi);
      console.log(string_hash);
      console.log(typeof(string_hash));
      App.contracts.Certificate.deployed().then(function(instance) {
        
        Instance=instance
        console.log("kuch toh");

        Instance.HashCalculation(addr,certi,pk).then(function(result) {
        
        console.log("Inside Hash");

      }).catch(function(err) {
        console.error(err);
        });

      web3.eth.sendTransaction({
          from: App.account,  
          data: string_hash
      },
      function(error, hash){
        if(error)
          console.log(error);
          console.log("abhi error");
        console.log("okay");

          Instance.addtoArray(addr,hash,certi).then(function(r){
            console.log(r);
            console.log(r["tx"]);
            console.log(certi);
            console.log("sent");
            console.log(hash);
            console.log(addr);
          }).catch(function(err) {
        console.error(err);
        });   
      })
      
          
      

        //$("#content").hide();
        //$("#loader").show();

      

      });
    }

};
//End of App Object
$(function() {
  $(window).load(function() {
    App.init();
  });
});