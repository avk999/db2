import './styles.css';
import $ from  'jquery';
const grapqlurl='/gq';
import Lokka from 'lokka'
import HttpTransport from 'lokka-transport-http';
const Transport=new HttpTransport(grapqlurl,{'credentials':false})
import strftime from 'strftime';
var moment = require('moment');
moment.locale('en-GB');



const gclient = new Lokka({
  transport: Transport});

const factions={
    1:{
        "name":"nyoko",
        "class":"nyoko",
        "icon":"https://battlemap.deltatgame.com/images/icons/megacorp-logos/nyoko-labs.png"
    },
    2:{
        "name":"cosmo",
        "class":"cosmo",
        "icon":"https://battlemap.deltatgame.com/images/icons/megacorp-logos/cosmostellar.png"
    },
    3:{name:"gene-x",
      "class":"genex",
      "icon":"https://battlemap.deltatgame.com/images/icons/megacorp-logos/gene-x.png"
      },
    4:{name:"humanoid",
      class:"humanoid"},
    "icon":"https://battlemap.deltatgame.com/images/icons/megacorp-logos/humanoid.png"
    }

var updaters={};
updaters.battles={};
updaters.battles.tickers={};
updaters.bases={};




function formatTime(seconds) {
            if (seconds > 24 * 60 * 60) {
                return '> 24h';
            }

            var numhours = parseInt(Math.floor(((seconds % 31536000) % 86400) / 3600), 10);
            var numminutes = parseInt(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 10);
            var numseconds = parseInt((((seconds % 31536000) % 86400) % 3600) % 60, 10);
            return ((numhours < 10) ? "0" + numhours : numhours)
                + ":" + ((numminutes < 10) ? "0" + numminutes : numminutes)
                + ":" + ((numseconds < 10) ? "0" + numseconds : numseconds);
        } // fix me to handle negative values!

function loc(x) {
    return x.toLocaleString('en-GB')
}



function startticker(x) {
 //   console.log(x);
    var mnames=['PT','M1','M2','M3','M4']
    var restime=Date.parse(x.resolutionTime+" UTC");
    var now=(new Date).getTime();
    var minus="";
//    for (var i=0;i<=3;i++){
//        var c="timemark";
//        var marktime=restime-(12*60*60*1000*i);
//        
//        var t=(marktime-now)/1000; //time to next checkpoint
//        if (t<0) {
//            t=-t;
//            minus="-";
//            c=c+" dark";
//        }
//        var dt=formatTime(t);
//      //  console.log("startticker: time left ",t,"formatTime:",dt);
//        $("#mark_"+x.id+"_"+(i+1)).text("M"+(4-i)+": "+ minus+" "+dt).addClass(c);
//    }
    
 // First milestone is 36 hrs before restime, 2nd 24 hrs, 3rd 12 hrs
  var milestones=[];
    milestones[0]=restime-(36*60*60*1000) - now;
    milestones[1]=restime-(27*60*60*1000) - now;
    milestones[2]=restime-(18*60*60*1000) - now;
    milestones[3]=restime-(9*60*60*1000) - now;
    milestones[4]=restime - now;
for (var i=1;i<=5;i++){
    minus="";
    var c="timemark"
    if (milestones[i-1]<0) {
        minus="In the past: ";
        c=c+" dark";
        milestones[i-1]=-1*milestones[i-1];
        
    }
    $("#mark_"+x.id+"_"+(i)).text(mnames[i-1]+": "+minus+formatTime(milestones[i-1]/1000)).addClass(c);
}
  var now=(new Date).getTime()
    minus="";
  //  var timeleft=(restime-now)/1000;
    var target="#battle_"+x.id+"> .timeleft";
    

  //  if (timeleft < 0) {
//        timeleft = -timeleft;
//        minus="-";
//    }
    var timeleft=strftime('%F %T',new Date(restime));
    var disptime=timeleft; //formatTime(timeleft);
    $(target).text(minus + disptime);
   // console.log(x.id,disptime);
    setTimeout(function(){
        startticker(x)}
               ,1000);
    
}



function initgrid(){
    $('body').append($("<h2 class=\"wallclock\">"));
    $('body').append($('<span>').text('> Upcoming battles').prop('style',"color:cyan; text-decoration:underline").on('click' ,function(){ $(".upcoming").toggle(600)}));

    $('body').append($('<div>').addClass('upcoming'));
    $('.upcoming').hide();

    $('body').append($('<div>').addClass('grid-container').attr('id','papa'));
    $('body').append($('<div>').addClass('log'));
    $('body').append($('<div>').addClass('syslog'));
}


function wallclock(){
    var disp="Current time: "+strftime('%H:%M:%S');
    $(".wallclock").text(disp);
    setTimeout(function(){
        wallclock()
    }, 1000)
}


function initbattles(r) {
    console.log("in initbattles: ",r.battles);
    var b=r.battles.sort(function(x,y){return (Date.parse(x.resolutionTime+ " GMT") - Date.parse(y.resolutionTime +" GMT"))})
    b.forEach(function(x){

        var target="#battle_"+x.id;
        $("#papa").append($("<div>").attr("id","battle_"+x.id).addClass('battlebox').addClass(factions[x.factionEnum].class));
        $(target).addClass(factions[x.factionEnum].class);
        $(target).append($("<div class=\"battleid\">").text(x.battleUniqueID));
        $(target).append($("<div class=\"timeleft\">"));
        $(target).append($("<div class=\"msbox\">"));
        for (var i=1;i<=5;i++) {
            $(target+" >.msbox").append($("<div>").addClass("mark").attr('id',"mark_"+x.id+"_"+i));
        }
        $(target).append($("<div>"));
        $(target).append($("<div class=\"ownbase\">"));
        $(target).append($("<div class=\"oppobase\">"));
        $(target).append($("<div class=\"ownplayer\">"));
        $(target).append($("<div class=\"oppoplayer\">"));

         $(target).append("<div>");

        $(target).append($("<div class=\"ownstrength\">"));
        $(target).append($("<div class=\"moreorless\">"));
        $(target).append($("<div class=\"oppostrength\">"));
        $(target).append($("<div class=\"oppomltng\">").html('&nbsp;'));
        $(target).append($("<div class=\"ownmltng\">").html('&nbsp;'));
        $(target).append($("<div class=\"oppomods\">"));
        $(target).append($("<div class=\"ownmods\">"));
 
        $(target).append($("<div>"));
 //       $(target).append($("<div class=\"isdone\">"));

        $(target).append($("<div class=\"in_by\">"));
        $(target).append($("<div class=\"updatestatus\">"));
        $(target).append($("<div class=\"nextupdate\">"));
        var fstring=strftime('%F %T',new Date(Date.parse(x.resolutionTime+" GMT")))+" "+x.battleUniqueID+"  ";
        $('.upcoming').append($('<div>').text(fstring).attr('id','upc_'+x.id));
        $('#upc_'+x.id).append($('<span class=\"fighters\">'));
        $('.log').append($("<div class=\"battlelog\">").attr('id','log_'+x.id));
        $('#log_'+x.id).append("<div class=\"loghead\">");
        $('#log_'+x.id).append("<div class=\"logbody\">");

        $("#log_"+x.id).prepend($("<div>").text(strftime('%H:%M:%S')+" Started log for battle "+x.battleUniqueID));
        startticker(x);

        getbattleinfo(x);

    }
             )
}


function getbattleinfo(battle) {
//    console.log("getbattleinfo, ",battle.id)
    const q=`
    query battleDetail($inp:EntityInput)
    {
        battleDetail(args:$inp)

        {
            id
            oppoBaseDetails {
      bf
      bs_id
      nm
      lvl
      mltng
      ownr
      strngth
      
      rings { cd r_no lvl}
      bs_lnks {fwd}
      cr_lnks {ltd}
    }
            ownBaseDetails {
      bf
      bs_id
      nm
      lvl
      mltng
      ownr
      strngth
      rings { cd r_no lvl}
      bs_lnks {fwd}
      cr_lnks {ltd}
      
    } 
    initiated_by_id
    is_done
    attack_on
        } } `;
    const v={inp:{id:battle.id}};
    gclient.query(q,v).then(
        result => {
                  console.log("getbattle ",battle.id,result);
                      var target="#battle_"+battle.id;
                    var in_by="Initiator: COSMO";

                 
                    if (result.battleDetail.ownBaseDetails.bf != 2) {
                        var t=result.battleDetail.oppoBaseDetails;
                        result.battleDetail.oppoBaseDetails = result.battleDetail.ownBaseDetails;
                        result.battleDetail.ownBaseDetails = t;
                        in_by="Initiator: ENEMY";
                        
                        }
                    $("#upc_"+battle.id+" > .fighters").text(" "+result.battleDetail.ownBaseDetails.ownr+" vs "+result.battleDetail.oppoBaseDetails.ownr);

                    var oppomods={
                        vectors:0,
                        empty:0
                        
                    }
                    var ownmods={
                        vectors:0,
                        empty:0
                    }
                   
                   for (var i=0;i<result.battleDetail.oppoBaseDetails.rings.length;i++){
                       for (var j=0;j<result.battleDetail.oppoBaseDetails.rings[i].length;j++){
                //           console.log("i:",i,"j:",j,result.battleDetail.oppoBaseDetails.rings[i],)
                           if (result.battleDetail.oppoBaseDetails.rings[i][j].cd==3) {oppomods.vectors++}
                       }
                       oppomods.empty=oppomods.empty + (8-result.battleDetail.oppoBaseDetails.rings[i].length);
                   }
                    oppomods['freevectors']=oppomods.vectors-result.battleDetail.oppoBaseDetails.bs_lnks.length - result.battleDetail.oppoBaseDetails.cr_lnks.length;
            
                   
                   for (var i=0;i<result.battleDetail.ownBaseDetails.rings.length;i++){
                       for (var j=0;j<result.battleDetail.ownBaseDetails.rings[i].length;j++){
                //           console.log("i:",i,"j:",j,result.battleDetail.oppoBaseDetails.rings[i],)
                           if (result.battleDetail.ownBaseDetails.rings[i][j].cd==3) {ownmods.vectors++}
                       }
                       ownmods.empty=ownmods.empty + (8-result.battleDetail.ownBaseDetails.rings[i].length);
                   }
                    ownmods['freevectors']=ownmods.vectors-result.battleDetail.ownBaseDetails.bs_lnks.length - result.battleDetail.ownBaseDetails.cr_lnks.length;            
            
         //           console.log('mods: ',oppomods)
                   $(target + " > .oppomods").text("Free Vectors: "+oppomods.freevectors);
                   $(target + " > .ownmods").text("Free Vectors: "+ownmods.freevectors);

  
                   $(target + " > .oppobase").text("&"+result.battleDetail.oppoBaseDetails.nm);
                   $(target + " > .ownbase").text("&"+result.battleDetail.ownBaseDetails.nm).addClass("cosmo");
                   $(target + "> .ownplayer").text("@"+result.battleDetail.ownBaseDetails.ownr).addClass("cosmo");
                   $(target + "> .oppoplayer").text("@"+result.battleDetail.oppoBaseDetails.ownr);
                   $(target + "> .ownstrength").text(loc(parseInt(result.battleDetail.ownBaseDetails.strngth))).addClass("cosmo");
                   $(target + "> .oppostrength").text(loc(parseInt(result.battleDetail.oppoBaseDetails.strngth)));
                   $(target + "> .isdone").text(result.is_done? "Finished" : "In progress");
                   $(target + "> .updatestatus").text("Updated: "+strftime('%H:%M:%S'));
                   $(target + "> .in_by").text(in_by);
                   if (result.battleDetail.ownBaseDetails.mltng) {$(target+" > .ownmltng").text('Meltdown')}
                   if (result.battleDetail.oppoBaseDetails.mltng) {$(target+" > .oppomltng").text('Meltdown')}

                   var moreorless=">";
                   var mlclass="greener";
                   if (result.battleDetail.ownBaseDetails.strngth < result.battleDetail.oppoBaseDetails.strngth) {
                       moreorless="<";
                       mlclass="redder";
                
                   }
                   $(target+ "> .moreorless").empty();
                   $(target+"> .moreorless").append($("<span>").text(moreorless).addClass(mlclass));
                   var logtarget="#log_"+battle.id;
                   $(logtarget + " > .loghead").empty();
                   $(logtarget + " > .loghead").append($("<div>").text(result.battleDetail.ownBaseDetails.ownr + "  vs  "+ result.battleDetail.oppoBaseDetails.ownr));
                    logtarget=logtarget+" > .logbody";
                    var t=loc(parseInt(result.battleDetail.ownBaseDetails.strngth))+" vs "+loc(parseInt(result.battleDetail.oppoBaseDetails.strngth));
        //           $(logtarget).prepend($("<div>").text(strftime('%H:%M:%S')+ " "+ loc(parseInt(result.battleDetail.ownBaseDetails.strngth))+" vs "+loc(parseInt(result.battleDetail.oppoBaseDetails.strngth))));
                   $(logtarget).prepend($("<div>").text(strftime('%F %T')).append($("<span>").text(t).css('margin-left','50px')));
                   var restime=Date.parse(result.battleDetail.attack_on+" UTC");
                   var now=(new Date).getTime()
                   
                   var timeleft=48*60*60;
                

//                   var timeleft=(restime-now)/1000;
//                   if (timeleft < 15*60) {$(target).addClass("alert");}
//                   var delay=10*60; // uninteresting battles get refreshed at 10 minutes interval
//                   // var delay=60; //DEBUG
//                   if (timeleft < 60*60) {delay=60} 
//                   if (timeleft < 5*60) {delay=10}
//                   if (timeleft < 2*60 ) {delay=5}
//                   $(target + "> .nextupdate").text("update freq "+delay+" sec");
//                   if (result.battleDetail.is_done == 0) {
//        //               console.log("setting update for ",result.battleDetail,"in "+delay+" seconds")
//                        setTimeout(function(){
//                                    getbattleinfo(result.battleDetail)},delay*1000);                                    ;
//                    }
            
              var milestones=[];
            milestones[0]=(restime-(36*60*60*1000) - now)/1000;
            milestones[1]=(restime-(27*60*60*1000) - now)/1000;
            milestones[2]=(restime-(18*60*60*1000) - now)/1000;
            milestones[3]=(restime-(9*60*60*1000) - now)/1000;
            milestones[4]=(restime - now)/1000;
            for (var i=0;i<=4;i++){
            if (milestones[i]>0) {
                if (milestones[i] < timeleft) {timeleft=milestones[i]}
                }
            }
            var delay=10*60; // uninteresting battles get refreshed at 10 minutes interval
//       // var delay=60; //DEBUG
            $(target).removeClass('alert');
            if (timeleft < 60*60) {delay=60} 
            if (timeleft < 5*60) {delay=10; $(target).addClass('alert')}
            if (timeleft < 2*60 ) {delay=5 ; $(target).addClass('alert')}
            $(target + "> .nextupdate").text("update freq "+delay+" sec");
           if (result.battleDetail.is_done == 0) {
        //               console.log("setting update for ",result.battleDetail,"in "+delay+" seconds")
                        setTimeout(function(){
                                    getbattleinfo(result.battleDetail)},delay*1000);                                    ;
                    }
        
                  }, 
        result=>{ // error
            console.log('getbattleinfo: error: ',battle.id,result);
            $("#battle_"+battle.id+" > .updatestatus").text("Unable to update, battle over?").addClass('redder');
            $(".syslog").append("<div>").text("Update failed, id="+battle.id+" result="+JSON.stringify(result));
   //         var restime=Date.parse(result.battleDetail.attack_on+" UTC");
            var now=(new Date).getTime();
            $(".syslog").append("<div>").text("Update failed, id="+battle.id+" result="+JSON.stringify(result) +"Stopping updates");
   

    
            } // error handler
        );
}
        

    

function getbattles(){
    const query = `
    query {
    battles  { id battleUniqueID oppoBase ownBase finished resolutionTime factionEnum  }
  }
`;
  gclient.query(query).then( result => {
   initbattles(result) 
  }, 
    result=>{
      console.log('getbattles error: '+result);
 $('body').prepend(
     $("<H1>").text("Server error. Please reload in a few minutes.").addClass("fatal"));
     $(".syslog").append($("<div>").text("Unable to get battle list: "+result));// + " ("+JSON.stringify(result)+")"));

                                  }) ;
}





$(document).ready(function(){
    $("title").text('Primary dashboard')
    wallclock();
    initgrid();
    getbattles();
})
