App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  temp:0,

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

      return App.render();
    });
  },


  display:function(c,add){

    App.contracts.Certificate.deployed().then(function(instance) {
      Instance=instance;
      var Results = $("#Results");
      var Template="";
    for(var k=0;k<c;k++)
    {
            
            App.temp = k;
            Instance.certificates(add,k).then(function(arr){
            Template = "<div class='card'>";
            Template += "<img class='farhan' src='" + arr[1] + "' class='card-img-top' style='width:40%'>";
            Template += "<div class='container'><h4><b>Hash value</b></h4><p class='secimage'>"
            Template += arr[0]
            Template += "</p><input type='text' class='col-6 verifieraddr'><br/><input type='button' class='btn btn-primary verifier' name='"+App.temp+"' value='Send' onClick='App.verifier("+k+")'></div></div>"

            
            Results.append(Template);
      })
    }
    
})
  },


  displayVerifier:function(c,add){

    App.contracts.Certificate.deployed().then(function(instance) {
      Instance=instance;
      var Results = $("#Results2");
      var Template="";
    for(var k=0;k<c;k++)
    {
            
            App.temp = k;
            Instance.verifiers(add,k).then(function(arr){
            Template = "<div class='cardv'>";
            Template += "<img class='farhanv' src='" + arr[1] + "' class='card-img-top' style='width:40%'>";
            Template += "<div class='container'><h4><b>Hash value</b></h4><p class='secimagev'>"
            Template += arr[0]
            Template += "</p><p>Verified</p></div></div>"

            
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


  readFilev: function(){
    var certi;
    if (this.files && this.files[0]) {
        
        var FR= new FileReader();
        
        FR.onload = function(e) {

          $('#imgv').attr('src', e.target.result);
          $("#b64v").html(e.target.result);
          certi=e.target.result;
          certi.toString()
         
          var hash = 0, i, chr;
    
        for (i = 0; i < certi.length; i++) {
      chr   = certi.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; 
    }

      
      $("#string_hashv").html(hash.toString()); 
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
  $("#inpv").on("change", App.readFilev);


    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
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
            App.displayVerifier(c,add);
              
        })

          
        } 
      
      });
  
      loader.hide();
      content.show();
   },


      hash:function(){
        
      var certi;

      
      certi=$("#b64").text();
      addr=$("#address").val();
      pk=$("#pk").val();
      string_hash=$("#string_hash").text().toString();
      
      App.contracts.Certificate.deployed().then(function(instance) {
        
        Instance=instance
        

        Instance.HashCalculation(pk).then(function(result) {
        
        

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
          

          Instance.addtoArray(addr,hash,certi).then(function(r){
            
            location.reload();
          }).catch(function(err) {
        console.error(err);
        });   
      })
      

      });
    },
     verifier:function(e,k){
    // console.log($base[e]);
    // console.log($img[e]);
    var addr = $('.verifieraddr').eq(e).val();
   var base = $base[e];
   var hash = $img[e];

App.contracts.Certificate.deployed().then(function(instance) {
        
        Instance=instance
        

        Instance.addCertitoVerifier(addr,hash,base).then(function(result) {
        
      }).catch(function(err) {
        console.error(err);
        });
})
 },


 verify:function(){
    var string_hash = $("#string_hashv").val();
    var txnhash = $("#txnhash").val();
    var comp;
    

    web3.eth.getTransaction(
          txnhash,
      function(error, hash){
        if(error)
          console.log(error);
          
        
      comp = web3.eth.abi.decodeParameter('string',hash["input"]);
      console.log(comp);
        
      });

      if(comp==string_hash)
      {
        $("#result").html("Verified!!");
        $("#result").show();
      }
      else
      {
        $("#result").html("Fake!!");
        $("#result").show(); 
      }
 }

};
//End of App Object

$(function() {
  $(window).load(function() {
    App.init();
  });
  $('#verifdiv').hide();
  $base = []
  $img = []
  $('#transition').on('click', function(){
    if (App.fhash==0){
      App.fhash=1
    }
    else{
      App.fhash=0
    }
    $('.hide').addClass('set').removeClass('hide');
    $('.seek').addClass('hide').removeClass('seek');  
    $('.set').addClass('seek').removeClass('set');  
    $images = $('.farhan');
    
    if ($images) {
      $('.farhan').each(function( index ) {
        $base.push($(this).attr('src'));
      });
      $('.secimage').each(function( index ) {
        $img.push($(this).text());
      });
    }
    $count = 0;
    $('.card').each(function(index){
      $str = "App.verifier("+$count+")";
      $(this).children().eq(1).children().eq(4).attr('onClick',$str);
      $count = $count + 1;
    })
  });
  
  $('.verifier').on("click", function(event) {
    
    event.preventDefault();
    $index = $(this).attr('name');

  });
  $('#veri').on('click', function(event){
    $('#content').hide();
    $('#verifdiv').show();
    App.contracts.Certificate.deployed().then(function(instance) {
      
      Instance = instance;
      
      return Instance.vercount();

    }).then(function(Count){
      
      var Results = $("#Results2");
      Results.empty(); 

      for (var i = 1; i <= Count ; i++) {
        var c;
        var add;
        var k;
        var Template = "";

        Instance.Verifiers(i).then(function(result){
                 
            add=(result[0]);
            c=(result[1]["c"][0]);
            App.displayVerifier(c,add);
              
        })

          
        } 
      
      });
  });
  $count = 0;




});
