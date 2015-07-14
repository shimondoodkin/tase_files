
if(require.main === module) { var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, }); } //there is console you can type in and run global functions and use global variables

fs=require('fs');

async=require('async');
moment=require('moment');moment.locale('he');
var httpreq=require('httpreq');process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var JSZip = require("jszip");
iconv = new require('iconv').Iconv('ISO-8859-8','UTF-8');
Sync = require('sync');

// Run in a fiber

sync=function (cb)
{
    d=new Date("10/10/2014");
    end=new Date(); end.setDate(end.getDate()-1);
    prelast=new Date(); prelast.setDate(prelast.getDate()-3);
    if(end.getHours()>17)end.setDate(end.getDate()+1);
    toget=[];
    while(d.getTime()<end.getTime())
    {
     var nn="Full"+moment(d).format("YYYYMMDD")+"0.zip";
     var ff=__dirname+"/data/"+nn;
     var uu="https://www.tase.co.il/_layouts/Tase/Public/PackTarget/"+nn;
     if((!fs.existsSync(ff))||(d.getTime()>prelast.getTime()&&getFilesizeInBytes(ff)<200000))
     {
      toget.push({ff:ff,uu:uu,nn:nn,d:d.getTime()});
     }
     d.setDate(d.getDate()+1)
    }
    console.log(toget)
    //npm install unzip

    async.eachLimit(toget, 1, requestApi, function(err,ee){
        console.log("done sync");
        if(cb)cb();
    });
}

function requestApi(data,cb)
{
    httpreq.get(data.uu, {binary: true,headers:{
    
                Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding':'gzip, deflate, sdch',
                'Accept-Language':'he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4,ru;q=0.2',
                'Cache-Control':'no-cache',
                Connection:'keep-alive',
                Cookie:'nlbi_119455=zshiZLAFWzZd5F7a+BpPhQAAAAB4YqKgNBEQg0ffycVbN2Ov; TS01514144_28=01d61dc74ee2a75733be078e30541b12a87e05be8c3d7ce2efd57068a8f304dfdc0202c28a8a7bd26a9db50159b5981da0478b151c; ASP.NET_SessionId=igogs545ipqyuquxn3kixf45; incap_ses_253_108069=V1D6edduKi/0KlG2Z9aCA7zrz1QAAAAA2wLN0h0AVm7FGe8gCjamag==; TS01aca22e=01ec0f280c4ae37f6c9596b0b72582b6cb762fa6e50e44b7faf0ecc42e1359ba973285b702b766ca12060d223d89559a3e94065390d0318b73dd98c5b153870689850547de0412797ed7397a6321c7a6f52383ef8c; incap_ses_289_109676=cvj5eM+XjhNqD+xQCLwCBIL5z1QAAAAA4z2Q2G5XiyCHAU1VsD4Z8w==; __utmt=1; __utma=120622605.107967393.1413442403.1422294567.1422912447.5; __utmb=120622605.33.10.1422912447; __utmc=120622605; __utmz=120622605.1422912447.5.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmv=120622605.igogs545ipqyuquxn3kixf45; lbinfo=3; TS01514144=01ec0f280c9669e5bf0f8bea6600c30e4de9191276931881d6706844734e47d985d717d5d2c2bf4a47d516b28353cbdd33003b1820f6ac7ddf3f6b032e17293b69ee60f285; tickerType=2; dtPC=-; dtLatC=45p21.5p40p22p20.5p138p30.5p95p40.5p21p26; dtCookie=5665FB75D760286299B44BF0CE65942A|www.tase.co.il|1',
                Host:'www.tase.co.il',
                Pragma:'no-cache',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36'
    }}, function (err, res){
        if (err){
            console.log(err);
            cb();
        }else{
            console.log(new Date(data.d).toString(),prelast.toString());
            if(data.d>=prelast.getTime()&&res.body.length==0)
            {
                console.log("no file "+data.nn);
                cb();
            }
            else
            fs.writeFile(data.ff, res.body, function (err) {
                if(err)
                    console.log("error writing file "+data.nn);
                cb();
            });
        }
    });

}

getFilesizeInBytes=function (filename)
{
 var fileSizeInBytes=0;
 try
 {
  var stats = fs.statSync(filename)
  fileSizeInBytes = stats["size"]
 }
 catch(e){}
 return fileSizeInBytes
}

getcolumnnames=function (code,name,skip)
{
 if(!skip)skip=[];
 var info=[];
 var names=[];
 Object.keys(tasefile[code]).forEach(function(rowtype) {
    tasefile[code][rowtype].forEach(function(a){
    if(!(rowtype=='99'||rowtype=='01'||a[2]=='Filler'))
    {
     info.push([name,rowtype,a[2],a[6]]);
     names.push(name+'-'+rowtype+"-"+a[2]);
    }
   })
  })
  return {names:names,info:info};
}

tasefile=
{
/*
to generate:
download pdfs then http://splitpdf.com 
http://www.onlineocr.net/ choose excel each file
paste in F6:
=""""&MID(E7,9,100)&""":["
[    =A7    ,    =C7    ,    =""""&B7&""""    ,    =""""&D7&""""    ,    =""""&E7&" "& A6&""""    ],
],
*/

'0096':{ // list of stocks for tomorrow

"01":[                                        
[    1    ,    2    ,    "Record Type"    ,    "9(2)"    ,    "Value = 01 Record Type 01: Header"    ],
[    2    ,    4    ,    "Filler"    ,    "9(4)"    ,    "Zeroes 1"    ],
[    3    ,    2    ,    "T.A.S.E. File ID"    ,    "9(2)"    ,    "Value = 96 2"    ],
[    4    ,    6    ,    "Date"    ,    "9(6)"    ,    "YYMMDD 3"    ],
[    5    ,    2    ,    "Version"    ,    "9(2)"    ,    " 4"    ],
[    6    ,    10    ,    "Filler"    ,    "X(10)"    ,    "Zeroes 5"    ],
[    7    ,    8    ,    "Valid Date"    ,    "9(8)"    ,    "YYMMDD (Next Trading Day) 6"    ],
[    8    ,    34    ,    "Filler"    ,    "X(34)"    ,    "Zeroes 7"    ],
[    9    ,    4    ,    "T.A.S.E. File ID (4 CHRS)"    ,    "9(4)"    ,    "Value = 0096 8"    ],
[    10    ,    8    ,    "Filler"    ,    "X(8)"    ,    "Zeroes 9"    ],
],                                        

"02":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 02 Record Type 02: Derivative Details"    ],
[    2    ,    8    ,    "Derivative ID"    ,    "9(8)"    ,    " 1"    ],
[    3    ,    2    ,    "Derivative Type"    ,    "99"    ,    "See Table 601 2"    ],
[    4    ,    8    ,    "Expiration Date"    ,    "9(8)"    ,    "YYYYMMDD ± Original 3"    ],
[    5    ,    8    ,    "Strike Price"    ,    "9(6)V9(2)"    ,    " 4"    ],
[    6    ,    2    ,    "Underlying Asset Code"    ,    "9(2)"    ,    "See Table 602 5"    ],
[    7    ,    7    ,    "Underlying Asset Multiplier"    ,    "9(5)V9(2)"    ,    " 6"    ],
[    8    ,    2    ,    "Underlying Asset Type"    ,    "9(2)"    ,    "See Table 605 7"    ],
[    9    ,    1    ,    "Adjusted Derivative Flag"    ,    "9"    ,    "1 ± Equity option whose characteristics were adjusted due to corporate actions on the share, 0 ± Other derivatives 8"    ],
[    10    ,    8    ,    "Upper Daily Fluctuation"    ,    "9(6)V99"    ,    "Maximum premium, zeroes for unlimited fluctuation 9"    ],
[    11    ,    8    ,    "Lower Daily Fluctuation"    ,    "9(6)V99"    ,    "Minimum premium, zeroes for unlimited fluctuation 10"    ],
[    12    ,    15    ,    "Derivative Hebrew Name"    ,    "X(15)"    ,    " 11"    ],
[    13    ,    1    ,    "Short Term Derivative Flag"    ,    "9"    ,    "1 ± Short term, 0 ± Long term 12"    ],
[    14    ,    1    ,    "New Derivative Flag"    ,    "9"    ,    "1 ± New, 0 ± Existing 13"    ],
[    15    ,    5    ,    "Filler"    ,    "X(5)"    ,    "Zeroes 14"    ],
[    16    ,    1    ,    "Market ID"    ,    "X"    ,    "See Table 681 15"    ],
[    17    ,    1    ,    "Derivative Issued During Trade Flag"    ,    "9"    ,    "1 ± New derivative issued during the trading day, 0 - No 16"    ],
],                                        

"03":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 03 Record Type 03: Derivative Details ± Second Record"    ],
[    2    ,    8    ,    "Derivative ID"    ,    "9(8)"    ,    " 1"    ],
[    3    ,    5    ,    "Fluctuation Coefficient"    ,    "9(5)"    ,    "Value multiplier 2"    ],
[    4    ,    1    ,    "Multiplier in Price Code"    ,    "9"    ,    "0 ± Implied, 1 ± Not implied 3"    ],
[    5    ,    8    ,    "Base Price"    ,    "9(6)V9(2)"    ,    "Zeroes for price not fixed 4"    ],
[    6    ,    10    ,    "Derivative Symbol"    ,    "X(10)"    ,    " 5"    ],
[    7    ,    4    ,    "Trading Start Time"    ,    "9(4)"    ,    "HHMM 6"    ],
[    8    ,    4    ,    "Trading End Time"    ,    "9(4)"    ,    "HHMM 7"    ],
[    9    ,    6    ,    "Minimum Order Size"    ,    "9(6)"    ,    "Value = 1 8"    ],
[    10    ,    6    ,    "Maximum Order Size"    ,    "9(6)"    ,    "For non- prearranged order 9"    ],
[    11    ,    5    ,    "Lot Size"    ,    "9(5)"    ,    " 10"    ],
[    12    ,    8    ,    "Last Trading Date"    ,    "9(8)"    ,    "YYYYMMDD 11"    ],
[    13    ,    1    ,    "Clearing Method"    ,    "9"    ,    "Clearing method on expiration: 0 ± Cash, 1 ± Physical 12"    ],
[    14    ,    9    ,    "Contract Size"    ,    "9(7)V9(2)"    ,    "In terms of underlying asset 13"    ],
[    15    ,    1    ,    "Expiration Week Number"    ,    "9"    ,    "The sequence number of the expiration week in the month - for weekly derivatives. Zero for all other derivatives 14"    ],
[    16    ,    2    ,    "Filler"    ,    "X(2)"    ,    "Zeroes 15"    ],
],                                        


"04":[
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 04 Record Type 04: Basket Securities List (CTD)"    ],
[    2    ,    8    ,    "Derivative ID"    ,    "9(8)"    ,    " 1"    ],
[    3    ,    1    ,    "Record Number"    ,    "9"    ,    "Sequential Number from 1 2"    ],
//[    4    ,    23*3    ,    "Basket Security Details"    ,    "Occurs 3"    ,    "Bond data included in basket 3"    ],
[    4.1    ,    8    ,    "Security ID1"    ,    "9(8)"    ,    "Bond security ID 4"    ],
[    4.2    ,    7    ,    "Conversion Factor1"    ,    "9V9(6)"    ,    " 4.1"    ],
[    4.3    ,    8    ,    "Accrued Interest1"    ,    "99V9(6)"    ,    " 4.2"    ],

[    4.1    ,    8    ,    "Security ID2"    ,    "9(8)"    ,    "Bond security ID 4"    ],
[    4.2    ,    7    ,    "Conversion Factor2"    ,    "9V9(6)"    ,    " 4.1"    ],
[    4.3    ,    8    ,    "Accrued Interest2"    ,    "99V9(6)"    ,    " 4.2"    ],

[    4.1    ,    8    ,    "Security ID3"    ,    "9(8)"    ,    "Bond security ID 4"    ],
[    4.2    ,    7    ,    "Conversion Factor3"    ,    "9V9(6)"    ,    " 4.1"    ],
[    4.3    ,    8    ,    "Accrued Interest3"    ,    "99V9(6)"    ,    " 4.2"    ],
],


"05":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 05 Record Type 05: Derivative Details ± Third Record"    ],
[    2    ,    8    ,    "Derivative ID"    ,    "9(8)"    ,    " 1"    ],
[    3    ,    8    ,    "Exact Expiration Date"    ,    "9(8)"    ,    "YYYYMMDD 2"    ],
[    4    ,    8    ,    "Settlement Price Date"    ,    "9(8)"    ,    "YYYYMMDD 3"    ],
[    5    ,    12    ,    "ISIN"    ,    "X(12)"    ,    " 4"    ],
[    6    ,    7    ,    "Underlying Asset Price Multiplier"    ,    "9(5)V9(2)"    ,    " 5"    ],
[    7    ,    8    ,    "Underlying Asset Identifier"    ,    "9(8)"    ,    "Content according the value of 'Underlying Asset Type' field in record type 02: For share index - TACT index code (See Table 510), For currency rate - Currency code (See Table 104), For interest - Zeroes, For equity/bond - Security number 6"    ],
[    8    ,    2    ,    "Halt Reason Code"    ,    "9(2)"    ,    "Halt reason code from Table 304 (code 55) in the event of a known in advance suspension in the underlying asset share 7"    ],
[    9    ,    7    ,    "Open Positions Limit"    ,    "9(7)"    ,    "The underlying asset open positions limit which was valid when the derivative was issued 8"    ],
[    10    ,    2    ,    "Adjustment Number"    ,    "9(2)"    ,    "The serial number of the adjustment due to corporate actions on the share. 9"    ],
[    11    ,    1    ,    "Call 1 Flag"    ,    "9"    ,    "1- Call 1 option, 0- Other 10"    ],
[    12    ,    5    ,    "Discounted Coupon"    ,    "9(3)V9(2)"    ,    "Discounted coupon in Agorot for options with expiration date occurring after the expected ex date of the bond. Zeroes in all other cases 11"    ],
[    13    ,    6    ,    "Maximum Prearranged Order Size"    ,    "9(6)"    ,    " 12"    ],
[    14    ,    4    ,    "Filler"    ,    "X(11)"    ,    "Zeroes 13"    ],
],                                        


"99":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 99 Record Type 99: Trailer"    ],
[    2    ,    5    ,    "Total Number of Records"    ,    "9(5)"    ,    "Incl. Header and Trailer 1"    ],
[    3    ,    2    ,    "Version"    ,    "99"    ,    " 2"    ],
[    4    ,    71    ,    "Filler"    ,    "X(71)"    ,    "Zeroes 3"    ],
],                                        

},

'0028':{ //derivatives:

"01":[                                        
[    1    ,    2    ,    "Record Type"    ,    "9(2)"    ,    "Value = 01 Record Type 01: Header"    ],
[    2    ,    4    ,    "Filler"    ,    "9(4)"    ,    "Zeroes"    ],
[    3    ,    2    ,    "T.A.S.E. File ID"    ,    "9(2)"    ,    "Value = 28"    ],
[    4    ,    6    ,    "Date"    ,    "9(6)"    ,    "YYMMDD"    ],
[    5    ,    2    ,    "Version"    ,    "9(2)"    ,    ""    ],
[    6    ,    52    ,    "Filler"    ,    "X(52)"    ,    "Zeroes"    ],
[    7    ,    4    ,    "T.A.S.E. File ID (4 CHRS)"    ,    "9(4)"    ,    "Value = 0028"    ],
[    8    ,    8    ,    "Filler"    ,    "X(8)"    ,    "Zeroes"    ],
],                                        

"02":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 02 Record Type 02: Derivative Details"    ],
[    2    ,    8    ,    "Derivative ID"    ,    "9(8)"    ,    ""    ],
[    3    ,    2    ,    "Derivative Type"    ,    "99"    ,    "See Table 601"    ],
[    4    ,    8    ,    "Closing Price"    ,    "9(6)V99"    ,    ""    ],
[    5    ,    2    ,    "Closing Price Type"    ,    "99"    ,    "See Table 139"    ],
[    6    ,    8    ,    "Base Price"    ,    "9(6)V99"    ,    ""    ],
[    7    ,    1    ,    "Price Change Trend"    ,    "9"    ,    "1 ± Decline, 2 ± Advance"    ],
[    8    ,    8    ,    "Price Change"    ,    "9(6)V99"    ,    ""    ],
[    9    ,    8    ,    "Price Change Percentage"    ,    "9(6)V99"    ,    ""    ],
[    10    ,    8    ,    "Highest Price"    ,    "9(6)V99"    ,    ""    ],
[    11    ,    8    ,    "Lowest Price"    ,    "9(6)V99"    ,    ""    ],
[    12    ,    15    ,    "Derivative Hebrew Name"    ,    "X(15)"    ,    ""    ],
[    13    ,    1    ,    "Filler"    ,    "X"    ,    "Zero"    ],
[    14    ,    1    ,    "Market ID"    ,    "X"    ,    "See Table 681"    ],
],                                        



"03":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 03 Record Type 03: Derivative Additional Details"    ],
[    2    ,    8    ,    "Derivative ID"    ,    "9(8)"    ,    ""    ],
//[    3    ,    7    ,    "Turnover ± Units"    ,    "9(7)"    ,    ""    ],
[    3    ,    7    ,    "Turnover Units"    ,    "9(7)"    ,    ""    ],
//[    4    ,    15    ,    "Turnover ± Monetary Value"    ,    "9(13)V99"    ,    "In terms of premium in NIS"    ],
[    4    ,    15    ,    "Turnover Monetary Value"    ,    "9(13)V99"    ,    "In terms of premium in NIS"    ],
[    5    ,    15    ,    "Volume of Trade"    ,    "9(15)"    ,    "In terms of underlying asset in NIS"    ],
[    6    ,    10    ,    "Underlying Asset Price"    ,    "9(6)V9(4)"    ,    "Closing price"    ],
[    7    ,    4    ,    "Number of Transactions"    ,    "9(4)"    ,    "If Value >9999, will contain 9999"    ],
[    8    ,    7    ,    "Open Positions"    ,    "9(7)"    ,    "Up to beginning of trading day"    ],
[    9    ,    1    ,    "Open Positions Change Trend"    ,    "9"    ,    ", QUIRIRQIIRSILEERXVISD¶VRSIRQV 1 ± Decline, 2 ± Advance"    ],
[    10    ,    7    ,    "Open Positions Change Percentage"    ,    "9(6)V9"    ,    ", QUIRIRQIIRSILEERXVISD¶V&SISRQV"    ],
[    11    ,    4    ,    "Filler"    ,    "X(4)"    ,    "Zeroes"    ],
],                                        

"04":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 04 Record Type 04: Derivative Additional Details (*)"    ],
[    2    ,    8    ,    "Derivative ID"    ,    "9(8)"    ,    ""    ],
[    3    ,    6    ,    "Number of Transactions"    ,    "9(6)"    ,    ""    ],
[    4    ,    64    ,    "Filler"    ,    "X64"    ,    "Zeroes"    ],
],                                        
//(*) Record type 04 is sent when the number of transactions exceeds 9999 (see remark in field no.7, record type 03).

"99":[                                        
[    1    ,    2    ,    "Record Type"    ,    "99"    ,    "Value = 99 Record Type 99: Trailer"    ],
[    2    ,    5    ,    "Total Number of Records"    ,    "9(5)"    ,    "Incl. Header and Trailer"    ],
[    3    ,    2    ,    "Version"    ,    "99"    ,    ""    ],
[    4    ,    71    ,    "Filler"    ,    "X(71)"    ,    "Zeroes"    ],
],                                        

}}


expandparserformat=function()
{
   // X means any char, V means point seperator here, number in () means repeat times the number
   // below is translation of it to a regular expression and create an unformat function instead of using regexp
   //
   var name=2,len=1,format=3,comments=4,unformat=5,sqldatatype=6,regexpr=7;//parser descriptor cols
   //var cols={};
   Object.keys(tasefile).map(function(code) {
      var parser=tasefile[code];
       Object.keys(parser).map(function(type) {
           var lineparser=parser[type];
           for(var parsercol,i=0;i<lineparser.length;i++)
           {
            (function(){
            parsercol=lineparser[i];
            var ff=parsercol[format];
            var f=ff.replace(/[(]/g,'{').replace(/[)]/g,'}').replace(/[{]9[}]/g,'{N}').replace(/9/g,'\\d').replace(/X/g,'.').replace(/[{]N[}]/g,'{9}');
            var uf;
            var sq;
            var r
            if(ff.indexOf('X')!=-1) //trim chars
            {
             //console.log(code,type,parsercol[name],'x');
             r=/^\s+|\s+$/gm
             uf=function(t){ return t.replace(r,"")}
             sq='VARCHAR('+parsercol[len]+')';
            }
            else if(ff.indexOf('V')!=-1)// has V, to float
            {
            
             f="("+f.replace(/V/g,')(')+")"; //make (\dV\d) to (\d)(\d)
             //console.log(code,type,parsercol[name],'V',f);
             r=new RegExp(f);
             uf=function(t){ return parseFloat(t.replace(r,"$1.$2"))}
             var declen=parsercol[format].split('V')[1];
             if(declen.indexOf('(')==-1)declen=declen.length;
             else declen=declen.split('(')[1].split(')')[0];
             sq='DECIMAL('+parsercol[len]+','+declen+')';
             //sq='DECIMAL('+parsercol[len]+','+parsercol[format]+')';
            }
            else // no V, so to int
            { //parseInt has issues with leading zeros dont know how not, so suggested to sue parse float instead
             r=undefined;
             //console.log(code,type,parsercol[name],'I');
             uf=function(t){ return parseFloat(t)}
             sq='DECIMAL('+parsercol[len]+')';
            }
            //parsercol[unformat]=r
            parsercol[unformat]=uf
            parsercol[sqldatatype]=sq
            parsercol[regexpr]=r
            })();
           }
       });
    });
}
expandparserformat();




parsefileinzip=function(zip,code)
{
     //////
    var parser=tasefile[code];
    var rows={};
    var name=2,len=1,format=3,comments=4,unformat=5;//parser descriptor cols
    if(!parser) console.log("no parser for "+code);
    else
    {
        Object.keys(parser).map(function(type) {
        rows['a'+type]=[];
        });
        var files=zip.file( new RegExp("^"+code,""));
        files.forEach(function(file)
        {
            var lines=iconv.convert(file.asNodeBuffer()).toString().split(/[\r\n]+/);
            for(var line,row=0;row<lines.length;row++)
            {
                line=lines[row];
                if(line.length==0)continue;
                var type=line.substr(0,2);
                var lineparser=parser[type];
                if(!lineparser) console.log("no lineparser for "+(line.substr(0,2)));
                else
                {
                    var arow={}
                    for(var parsercol,i=0,t=0;i<lineparser.length;i++)
                    {
                        parsercol=lineparser[i];
                        var nextt=t+parsercol[len];
                        var value=line.substring(t,nextt);
                        t=nextt;
                        //arow[ parsercol[name] ]=value; // unparsed
                        arow[ parsercol[name] ]=parsercol[unformat](value); //parsed
                        
                    }
                    arow.id=row;
                    rows['a'+type].push(arow)
                    //console.log(row,arow);
                }
            }
        })
    }
    return rows;
    ////////////
}

readzipfiles=function(zipfilename)
{
    var cachefile="cache/"+zipfilename+'_readzipfiles.json';
    if(fs.existsSync(cachefile))
        return JSON.parse(fs.readFileSync(cachefile));
//try{
    // read a zip file
    var data=fs.readFileSync(__dirname+"/data/"+zipfilename); 
    var zip = new JSZip(data);
    var tase={};
    tase.list=parsefileinzip(zip,'0096');
    tase.derivatives=parsefileinzip(zip,'0028');
    fs.writeFileSync(cachefile,JSON.stringify(tase));
    return tase;
    //readzip(zip,'0028')
//}catch(e){}
}
//tase=readzipfiles("Full201502020.zip");

//console.log(toget);



join_list_info_to_list02=function (tase,list)
{
    for(var a,i=0;i<list.length;i++)
    {
        a=list[i]
        a.list03=tase.list.a03.filter(       function(aa){return aa['Derivative ID']==a['Derivative ID']})[0];
        a.list04=tase.list.a04.length?
                 tase.list.a04.filter(       function(aa){return aa['Derivative ID']==a['Derivative ID']})[0]:undefined; // usually empty collection   
        a.list05=tase.list.a05.filter(       function(aa){return aa['Derivative ID']==a['Derivative ID']})[0];
        /*
        //this would not work this list is of tomorrow day, the derivcatives are of today:

        a.der02 =tase.derivatives.a02.filter(function(aa){return aa['Derivative ID']==a['Derivative ID']})[0];
        a.der03 =tase.derivatives.a03.filter(function(aa){return aa['Derivative ID']==a['Derivative ID']})[0];
        a.der04 =tase.derivatives.a04.length?
                 tase.derivatives.a04.filter(function(aa){return aa['Derivative ID']==a['Derivative ID']})[0]:undefined; // usually empty collection
        */
    }
    return list;
}

join_der_info_to_prevday_list02=function (tase,prevday_list)
{
    for(var a,i=0;i<prevday_list.length;i++)
    {
        a=prevday_list[i]
        a.der02 =tase.derivatives.a02.filter(function(aa){return aa['Derivative ID']==a['Derivative ID']})[0];
        a.der03 =tase.derivatives.a03.filter(function(aa){return aa['Derivative ID']==a['Derivative ID']})[0];
        a.der04 =tase.derivatives.a04.length?
                 tase.derivatives.a04.filter(function(aa){return aa['Derivative ID']==a['Derivative ID']})[0]:undefined; // usually empty collection
    }
    return prevday_list;
}

extend_list02=function (tase_prev,prevday_list,tase)
{
               join_list_info_to_list02(tase_prev,prevday_list) //enrich prevday_list with more info from its listing 
 return join_der_info_to_prevday_list02(tase     ,prevday_list)
}

//unused
uni=function(ar,k)
{
 var uni=[]; for(var v,i=0;i<ar.length;i++) { v=ar[i][k]; if(uni.indexOf(v)==-1) uni.push(v); }
 return uni
}

exp_dates=function(ar){
 var uni=[]; for(var v,i=0;i<ar.length;i++) { v=ar[i].list05['Settlement Price Date']; if(uni.indexOf(v)==-1) uni.push(v); }
 return uni
};

exp_filter=function(ar,d){
 return ar.filter(function(a){return a.list05['Settlement Price Date']==d});
};


/*
Table 681 – Derivatives Markets
Market ID Market Description
M TACT - Derivatives - TA-25
D TACT - Derivatives - US Dollar
I TACT - Derivatives - 3 Months Interest Rate Deleted From Date 07/10/2009
K TACT - Derivatives - TA-Banks
E TACT - Derivatives - Euro
O TACT - Derivatives - Medium Term Shahar Deleted From Date 12/03/2008
P TACT - Derivatives - Long Term Shahar Deleted From Date 12/03/2008
Q TACT - Derivatives - Equities
G TACT - Derivatives - Government Bonds
A TACT - Derivatives - TA-100
*/
/*
Derivative Type 
Table 601 – Derivative Type
Derivative Type, Derivative Type Description 
01 Call Option
02 Put Option
03 Future
04 Weekly Call Option
05 Weekly Put Option
06 Weekly Future
*/

//(a['Derivative Type']==1||a['Derivative Type']==2)&&a['Market ID']=='M' // monthly
//(a['Derivative Type']==4||a['Derivative Type']==5)&&a['Market ID']=='M' // weekly
//fitler derivatives by month , by week , also by id and their expiery dates
derta25=function(der)
{
    var dt25m=der.filter(function(a){return (a['Derivative Type']==1||a['Derivative Type']==2||a['Derivative Type']==3)&&a['Market ID']=='M'})
    var dt25w=der.filter(function(a){return (a['Derivative Type']==4||a['Derivative Type']==5||a['Derivative Type']==6)&&a['Market ID']=='M'})
    //exp_dates(dt25w)
    var dt25mexp=exp_dates(dt25m)
    var dt25mex={};var mn=dt25mexp.map(function(d){ return dt25mex[d]=exp_filter(dt25m,d); })
    var dt25wexp=exp_dates(dt25w)
    var dt25wex={};var wn=dt25wexp.map(function(d){ return dt25wex[d]=exp_filter(dt25w,d); })
    
    
    var allbyidm={};dt25m.forEach (function(a){allbyidm[a['Derivative ID']]=a})
    var allbyidw={};dt25w.forEach (function(a){allbyidw[a['Derivative ID']]=a})
    
    return     {
      allm:dt25m,
      allw:dt25w,
      byidm:allbyidm,
      byidw:allbyidw,
      mexp:dt25mexp,
      m:dt25mex,
      mn:mn,
      wexp:dt25wexp,
      w:dt25wex,
      wn:wn
    }
}

 sql_colname_numeric={};
 sql_colid_numeric=[];
 der_table_all_sql=function() // copied from below until var data and changed 
 {
    //info.push([name,rowtype,a[2],a[6]]); //make titles look like get column names:
 
    var titles=[
       'day',
       'prevday',
       'expday',
       'market',
       'monthweek',
       'Derivative Type',
       'Strike Price',
       'VWAP Price',
       
       'Open Positions Diff',
       'Open Positions',
       
       'Derivative Hebrew Name',
       //'Settlement Price Date',
       'Open Positions Change Trend',
       'Money',
       'Diff Money',
       'DerId'
      ];
      
   var titlesinfo=[
       ['titles','00','day','INT(8)'],
       ['titles','00','prevday','INT(8)'],
       ['titles','00','expday','INT(8)'],
       ['titles','00','market','VARCHAR(8)'],
       ['titles','00','monthweek','VARCHAR(1)'],
       
       ['titles','00','Derivative Type','VARCHAR(1)'],
       ['titles','00','Strike Price','DECIMAL(14,4)'],
       ['titles','00','VWAP Price','DECIMAL(14,4)'],
       
       ['titles','00','Open Positions Diff','INT(8)'],
       ['titles','00','Open Positions','INT(8)'],
       
       ['titles','00','Derivative Hebrew Name','VARCHAR(15)'],
       //'Settlement Price Date',
       ['titles','00','Open Positions Change Trend','INT(8)'],
       ['titles','00','Money','DECIMAL(14,4)'],
       ['titles','00','Diff Money','DECIMAL(14,4)'],
       ['titles','00','DerId','INT(8)']
      ];
      
    

      var listnames=getcolumnnames('0096','list');
      var dernames=getcolumnnames('0028','der');
      
      titlesinfo=titlesinfo.concat(listnames.info,dernames.info);
      
      titles=titles.concat(listnames.names,dernames.names);
      
      var str;
       str='CREATE TABLE IF NOT EXISTS `tasefiles`(\n'
      + 'id INT NOT NULL AUTO_INCREMENT,\n'
      + titlesinfo.map(function(a,k){ sql_colid_numeric[k]=sql_colname_numeric[titles[k]]=a[3].charAt(0)!='V'; return '`'+titles[k]+'` '+a[3]+' DEFAULT NULL'; }).join(',\n')+ '\n'
      + ',PRIMARY KEY (id), UNIQUE KEY `unique` (`day`,`expday`,`market`,`monthweek`,`DerId`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;';
      return str;
 }
 der_table_all_sql(); // generate sql_colid_numeric for sql() function
 
 //example run der_table_all_sql function in node repl to return table structure
 //require('fs').writeFileSync('table.sql', der_table_all_sql() );
 
 der_table_all=function(day,prevday,expday,market,monthweek,ar)
 {
    var titles=[
       'day',
       'prevday',
       'expday',
       'market',
       'monthweek',
       'Derivative Type',
       'Strike Price',
       'VWAP Price',
       
       'Open Positions Diff',
       'Open Positions',
       
       'Derivative Hebrew Name',
       //'Settlement Price Date',
       'Open Positions Change Trend',
       'Money',
       'Diff Money',
       'DerId'

      ];

      var listnames=getcolumnnames('0096','list');
      var dernames=getcolumnnames('0028','der');
      titles=titles.concat(listnames.names,dernames.names);


    var data=
    ar.map(function(a){
    var vwap,op,dop,row=  [
        day,
        prevday,
        expday,
        market,
        monthweek,
       (a['Derivative Type']==1||a['Derivative Type']==4)?"C":(    (a['Derivative Type']==2||a['Derivative Type']==5)?"P": 'F'   )  ,
       a['Strike Price']/a.list05['Underlying Asset Price Multiplier'],
       vwap=!a.der03?0:Math.round(a.der03['Turnover Units']>0?((a.der03['Turnover Monetary Value']/a.der03['Turnover Units'])/a.list05['Underlying Asset Price Multiplier']):(a.der02['Base Price']/a.list05['Underlying Asset Price Multiplier']) ),
       dop=a['Open Positions Diff'],
       op=!a.der03?0:a.der03['Open Positions'],
       a['Derivative Hebrew Name'],
       //a.list05['Settlement Price Date'],
       !a.der03?0:a.der03['Open Positions Change Trend'],
       op*vwap,
       dop*vwap,
       a['Derivative ID']
      ];
      
      row.forEach(function(a,i){
        if(Number.isNaN(a))row[i]=undefined;
      });
      
      listnames.info.forEach(function(n){
        try {
        if(n[1]=='02')
            row.push(a[n[2]]);
        else
            row.push(a['list'+n[1]][n[2]]);
        }catch(e){ row.push(undefined); }
      });
      
      dernames.info.forEach(function(n){
            try {
            row.push(a['der'+n[1]][n[2]]);
            }catch(e){ row.push(undefined); }
      });
      
      return row;
      
     });
     
     return [titles].concat(data);
     
 }

 der_table=function(ar)
 {
    var titles=[
       'Derivative Type',
       'Strike Price',
       'VWAP Price',
       
       'Open Positions Diff',
       'Open Positions',
       
       'Derivative Hebrew Name',
       //'Settlement Price Date',
       'Open Positions Change Trend',
       'Money',
       'Diff Money',
       'Id',

      ];
      
    var data=
    ar.map(function(a){
    var vwap,op,dop
      return  [
       (a['Derivative Type']==1||a['Derivative Type']==4)?"C":(    (a['Derivative Type']==2||a['Derivative Type']==5)?"P": 'F'   )  ,
       a['Strike Price']/a.list05['Underlying Asset Price Multiplier'],
       
       vwap=!a.der03?0:Math.round(a.der03['Turnover Units']>0?((a.der03['Turnover Monetary Value']/a.der03['Turnover Units'])/a.list05['Underlying Asset Price Multiplier']):(a.der02['Base Price']/a.list05['Underlying Asset Price Multiplier']) ),
       
       dop=a['Open Positions Diff'],
       op=!a.der03?0:a.der03['Open Positions'],
       
       a['Derivative Hebrew Name'],

       //a.list05['Settlement Price Date'],
       !a.der03?0:a.der03['Open Positions Change Trend'],
       op*vwap,
       dop*vwap,
       a['Derivative ID'],
      ]
      
     });
     
     return [titles].concat(data);
 }
 // convert single derivative into a simple format
 //der_table(dt25mex[0])
 //console.log(tsv(der_table(derta25(der).mn[0])))
 
 
/*
single derivative:
> dt25mex[0][0]
{ 'Record Type': 2,
  'Derivative ID': 81239733,
  'Derivative Type': 1,
  'Expiration Date': 20150227,
  'Strike Price': 100,
  'Underlying Asset Code': 1,
  'Underlying Asset Multiplier': 10000,
  'Underlying Asset Type': 1,
  'Adjusted Derivative Flag': 0,
  'Upper Daily Fluctuation': 0,
  'Lower Daily Fluctuation': 0,
  'Derivative Hebrew Name': 'C000001M502-25?',
  'Short Term Derivative Flag': 1,
  'New Derivative Flag': 0,
  Filler: '00000',
  'Market ID': 'M',
  'Derivative Issued During Trade Flag': 0,
  id: 358,
  list03:
   { 'Record Type': 3,
     'Derivative ID': 81239733,
     'Fluctuation Coefficient': 1,
     'Multiplier in Price Code': 0,
     'Base Price': 14451600,
     'Derivative Symbol': 'TA5B000001',
     'Trading Start Time': 930,
     'Trading End Time': 1735,
     'Minimum Order Size': 1,
     'Maximum Order Size': 2000,
     'Lot Size': 1,
     'Last Trading Date': 20150225,
     'Clearing Method': 0,
     'Contract Size': 10000,
     'Expiration Week Number': 0,
     Filler: '00',
     id: 359 },
  list05:
   { 'Record Type': 5,
     'Derivative ID': 81239733,
     'Exact Expiration Date': 20150227,
     'Settlement Price Date': 20150226,
     ISIN: 'IL0812397334',
     'Underlying Asset Price Multiplier': 100,
     'Underlying Asset Identifier': 2,
     'Halt Reason Code': 0,
     'Open Positions Limit': 30000,
     'Adjustment Number': 0,
     'Call 1 Flag': 1,
     'Discounted Coupon': 0,
     'Maximum Prearranged Order Size': 10000,
     Filler: '0000',
     id: 360 },
  der02:
   { 'Record Type': 2,
     'Derivative ID': 81239733,
     'Derivative Type': 1,
     'Closing Price': 14451600,
     'Closing Price Type': 1,
     'Base Price': 14447200,
     'Price Change Trend': 2,
     'Price Change': 4400,
     'Price Change Percentage': 3,
     'Highest Price': 14464000,
     'Lowest Price': 14450000,
     'Derivative Hebrew Name': 'C000001M502-25?',
     Filler: '0',
     'Market ID': 'M',
     id: 239 },
  der03:
   { 'Record Type': 3,
     'Derivative ID': 81239733,
     'Turnover Units': 23,
     'Turnover Monetary Value': 332386000,
     'Volume of Trade': 3326743,
     'Underlying Asset Price': 14464100,
     'Number of Transactions': 11,
     'Open Positions': 2435,
     'Open Positions Change Trend': 2,
     'Open Positions Change Percentage': 2,
     Filler: '0000',
     id: 240 } }
*/

 tsv=function(ar){
 return ar.map(function(a){return a.join('\t')}).join('\r\n');
 }
 
 sql=function(ar){
   t=ar[0];
   ar=ar.slice(1);
   isnumeric=sql_colid_numeric;
  return ar.map(function(a){
    return 'INSERT INTO tasefiles SET '+t.map(function(n,i){var v=a[i];return '`'+n+'`='+(v===undefined?'NULL':(isnumeric[i]?v:'"'+v+'"'))}).join(', ')
   });//.join(';\n')+';\n';
 }


 der_sort=function(t){
  return t.sort(function(a,b)
 { 
    if(a['Strike Price']>b['Strike Price']) return 1;
    if(a['Strike Price']<b['Strike Price']) return -1;
    if(a['Derivative Type']>b['Derivative Type'])return 1;
    if(a['Derivative Type']<b['Derivative Type'])return -1;
    return 0;
 });
 }
 //console.log(tsv(der_table(t)))
 
/*
//full example:
var tase=readzipfiles("Full201502020.zip");
var tase_prev=readzipfiles("Full201502010.zip");
var der=extend_list02(tase_prev,tase_prev.list.a02,tase); // add information to each stock in to list02
var ta25_bymonth_byweek_and_expierydates=derta25(der);
var ta25_monthly_nearest_month_to_expire_sorted=der_sort(ta25_bymonth_byweek_and_expierydates.mn[0])

var table=der_table(ta25_monthly_nearest_month_to_expire_sorted); //collect info about each option in list to a table
console.log(tsv(table))
console.log(tase.list.a01[0].Date+"\tto\t"+tase.list.a01[0]['Valid Date'])

var table=der_table_all('20150202','20150201',ta25_monthly_nearest_month_to_expire_sorted); //collect ALL info about each option in list to a table
require('fs').writeFileSync('sqltest.txt',sql(table.slice(0,3))) //save 3 rows as sql
 
*/


der_diff_open_positions=function(der_today_all,der_prevday_byid,prevdayexps)
{
 der_today_all.map(function(today){
  var prevday=der_prevday_byid[ today['Derivative ID'] ];
  //if(prevday===undefined) console.log("prevday.der03===undefined today['Derivative ID']=",today['Derivative ID'],' see id in der_prevday_byidg')
  var exp_id_not_found_in_previous_day=prevdayexps.indexOf(today.list05['Settlement Price Date'])==-1
  if(exp_id_not_found_in_previous_day)//first day of trading
   today['Open Positions Diff']= today.der03?today.der03['Open Positions']:0;
  else
  {
   if(prevday===undefined) // if missing then change is 0
    today['Open Positions Diff']= 0;
   else
    today['Open Positions Diff']= !prevday.der03?0: ( prevday.der03['Open Positions']   -   today.der03['Open Positions']);
  }
  
 })
 return der_today_all;
}

get_dates=function()
{
 return fs.readdirSync('data').filter(function(file){return getFilesizeInBytes('data/'+file)>200000 }).sort().reverse().map(function(a){return a.substr(4,8)}).map(function(a){
 var d=new Date(parseFloat(a.substr(0,4)),parseFloat(a.substr(4,2))-1,parseFloat(a.substr(6,2)),0,0,0,0)
 return a+'\t'+moment(d).format("YYYY-MM-DD\t"+(d.getDay()+1)+"\tdddd");
 }).join("\n");
}

addnextdate_files_w=function(ar)
{
 var a=ar[0].substr(4,8); var d=new Date(parseFloat(a.substr(0,4)),parseFloat(a.substr(4,2))-1,parseFloat(a.substr(6,2)),0,0,0,0); d.setDate(d.getDate()+1);
 ar.push("Full"+moment(d).format("YYYYMMDD")+"0.zip");
 //ar.unshift("Full"+moment(d).format("YYYYMMDD")+"0.zip"); 
 return ar;
}

get_dates_w=function(basic)
{
 var ar=fs.readdirSync('data').filter(function(file){return getFilesizeInBytes('data/'+file)!=0 }).sort().reverse().map(function(a){return a.substr(4,8)})
 var ar2=ar.map(function(a){
 var d=new Date(parseFloat(a.substr(0,4)),parseFloat(a.substr(4,2))-1,parseFloat(a.substr(6,2)),0,0,0,0)
 return a+'\t'+moment(d).format("YYYY-MM-DD\t"+(d.getDay()+1)+"\tdddd");
 });
 var a=ar[0]; var d=new Date(parseFloat(a.substr(0,4)),parseFloat(a.substr(4,2))-1,parseFloat(a.substr(6,2)),0,0,0,0); d.setDate(d.getDate()+1);
 ar2.unshift(moment(d).format("YYYYMMDD\tYYYY-MM-DD\t"+(d.getDay()+1)+"\tdddd")); 
 return ar2.join("\n");
 /*
 return fs.readdirSync('data').filter(function(file){return getFilesizeInBytes('data/'+file)!=0 }).sort().reverse().map(function(a){return a.substr(4,8)}).map(function(a){
 var d=new Date(parseFloat(a.substr(0,4)),parseFloat(a.substr(4,2))-1,parseFloat(a.substr(6,2)),0,0,0,0)
 return a+'\t'+moment(d).format("YYYY-MM-DD\t"+(d.getDay()+1)+"\tdddd");
 }).join("\n");
 */
}

function numberdate(x)
{
return x.replace(/(....)(..)(..)/,"$1-$2-$3")
}

var nofile_cache={};
get_date=function(w,date,expdate,expand)
{   
   function expandtablelines(data) //to old data add empty strikes in between. (at first there are less stikes availible) but i use the data today so it should be competible
   {

    var files=fs.readdirSync('data').filter(function(file){return getFilesizeInBytes('data/'+file)>200000 }).sort().reverse();
    //if(w && new Date().getDay()==5)
    
    var spliteddata=data.toString().split('\n').map(function(a){return a.split('\t')});
    //console.log(spliteddata)
    if(spliteddata.length<10) return data;
    var datastartsfrom=7;
    var exp=spliteddata.slice(0,10).filter(function(a,i){if(a[0]=='expire'){datastartsfrom=i;return true}else return false; })[0][1].replace(/-/g,'');
    exp=parseFloat(exp);
    var lastfile=files[0];
    if(exp>parseFloat(files[0].substr(4,8)))
        lastfile=files[1];
    else
    for(var i=0;i<files.length;i++)
    {
     //console.log("exp="+exp,"files[i]="+(files[i].substr(4,8)),exp<=parseFloat(files[i].substr(4,8)))
     if(exp>=parseFloat(files[i].substr(4,8)))
     {
        i++;
        lastfile=files[i];
        break;
     }
    }
    if(!lastfile) return "can't expand";
    //console.log('get_date',w,lastfile.substr(4,8),exp,false);
    //console.log("lastfile date=",lastfile.substr(4,8),exp);
    var expanddata=get_date(w,lastfile.substr(4,8),exp,false);
    var splitedexpanddata=expanddata.toString().split('\n').map(function(a){return a.split('\t')});
    
    /*
    [
    'Derivative Type', 0
    'Strike Price', 1
    'VWAP Price', 2
    
    'Open Positions Diff', 3
    'Open Positions', 4
    
    'Derivative Hebrew Name', 5
    //'Settlement Price Date',
    'Open Positions Change Trend', 6
    'Money', 7
    'Diff Money', 8
    
    ]
    */
    var expanded=splitedexpanddata.filter(function(){return true});//copy
    datastartsfrom+=1;
    //console.log('datastartsfrom',datastartsfrom)
    for(var j=0,i=0;i<expanded.length;i++)
    {
     if(i<=datastartsfrom) expanded[i]=spliteddata[j++];
     else if(j<spliteddata.length&&expanded[i][0]==spliteddata[j][0]&&expanded[i][1]==spliteddata[j][1]) {expanded[i]=spliteddata[j++];}
     else {
     //0
     //1
     expanded[i][2]=0;
     expanded[i][3]=0;
     expanded[i][4]=0;
     //5
     expanded[i][6]=0;
     expanded[i][7]=0;
     expanded[i][8]=0;
     }
    }
    expanded[datastartsfrom-2][0]="expanded using\t"+splitedexpanddata[0][1]+"\t"+splitedexpanddata[datastartsfrom-1][1];
    return expanded.map(function(a){return a.join('\t')}).join('\n');
   }
    
    expand=expand==undefined?true:expand;
    var cachefile="cache/"+date+'_'+(w?'w':'')+(expdate?expdate:'')+'.txt';
    if(fs.existsSync(cachefile))
    {
        console.log('cache hit',cachefile);
        var data= fs.readFileSync(cachefile);
        if(expand) data=expandtablelines(data);
        return data;
    }  
    if(nofile_cache[date]){
    console.log('cache hit',cachefile,'no file');
    return "no date";} 
     
    console.log('cache miss',cachefile);
    //date=20150202
    
    
    var files=fs.readdirSync('data').filter(function(file){return getFilesizeInBytes('data/'+file)>200000 }).sort();

    
    var nosecond=false;
    if(w){
        var havenextdate=false;
        if(new Date().getDay()==6-1) // add next day only in yom shishi
        {
         havenextdate=true;
         files.push(addnextdate_files_w(files));
        }
        var fileindex=files.indexOf("Full"+date+"0.zip")
        if(fileindex<3) { var notnewerfile=parseFloat(date)<parseFloat(files[files.length-1].substr(4,8));if(notnewerfile)nofile_cache[date]=true;return "no date";}
        if(havenextdate&&fileindexw==filesw.length-1) { nosecond=true;}
        /*var filesw=fs.readdirSync('data').filter(function(file){return getFilesizeInBytes('data/'+file)!=0 }).sort();
        var fileindexw=filesw.indexOf("Full"+date+"0.zip")
        if(fileindexw<3) { var notnewerfile=parseFloat(date)<parseFloat(files[files.length-1].substr(4,8));if(notnewerfile)nofile_cache[date]=true;return "no date";}
        var fileindex=files.indexOf("Full"+date+"0.zip")
        if(fileindex<3&&fileindexw==filesw.length-1) { nosecond=true;}
        */
    }
    else
    {
        var fileindex=files.indexOf("Full"+date+"0.zip")
        if(fileindex<3) { var notnewerfile=parseFloat(date)<parseFloat(files[files.length-1].substr(4,8));if(notnewerfile)nofile_cache[date]=true;return "no date";}
    }
    
 
    var prevday=undefined;
    if(w&&nosecond)
    {
    //console.log(filesw,filesw[fileindex-1])
    //var tase=          readzipfiles(                    "Full"+date+"0.zip");
    var tase_prev=     readzipfiles(prevday=filesw[fileindexw-1]);
    //var tase_prev_prev=readzipfiles(filesw[fileindexw-2]);
    tase=tase_prev;
    tase_prev_prev=tase_prev;
    }
    else
    {
    var tase=          readzipfiles(                    "Full"+date+"0.zip");
    var tase_prev=     readzipfiles(prevday=files[fileindex-1]);
    var tase_prev_prev=readzipfiles(files[fileindex-2]);
    }
    prevday=prevday.substring(4,4+8);
    extend_list02(tase_prev     ,tase_prev     .list.a02,tase     )
    extend_list02(tase_prev_prev,tase_prev_prev.list.a02,tase_prev)
    
    var der_today=derta25(tase_prev.list.a02);       //today's list from previous day
    var der_prevday=derta25(tase_prev_prev.list.a02);//prevday's list from previous previous day

    der_diff_open_positions(der_today.allm,der_prevday.byidm,der_prevday.mexp)
    der_diff_open_positions(der_today.allw,der_prevday.byidw,der_prevday.wexp)

    function maketext(w,d)
    {
        var der_today_w_or_mexp=(w?der_today.wexp:der_today.mexp);
        var t="";
        t+="today\t"+tase.list.a01[0].Date.toString().replace(/(..)(..)(..)/,"20$1-$2-$3")+"\tnextday\t"+tase.list.a01[0]['Valid Date'].toString().replace(/(....)(..)(..)/,"$1-$2-$3") +'\n'  //current and next trading day
        t+="prevday\t"+tase_prev.list.a01[0].Date.toString().replace(/(..)(..)(..)/,"20$1-$2-$3")+"\tnextday\t"+tase_prev.list.a01[0]['Valid Date'].toString().replace(/(....)(..)(..)/,"$1-$2-$3") +'\n' //current and next trading day
        t+="traded expire dates\t"+der_today_w_or_mexp.map(function(a){return a.toString().replace(/(....)(..)(..)/,"$1-$2-$3")}).join('\t')+'\n'
        t+="traded expire dates\t"+der_today_w_or_mexp.join('\t')+'\n\n'
        
        t+='expire\t'+der_today_w_or_mexp[d].toString().replace(/(....)(..)(..)/,"$1-$2-$3")+'\t'+der_today_w_or_mexp[d]+'\n'
        t+=tsv(der_table(der_sort((w?der_today.wn:der_today.mn)[d])))
        return t;
    }


    var d;
    if(expdate)
    {
     d=der_today.mexp.indexOf(parseFloat(expdate));
     if(d==-1)d=0;
    }
    else
     d=0;
    
     //t=maketext(false,d);
     der_today.mexp.forEach(function(vv,dd)
     {
      var tt=maketext(false,dd);
      if(dd==0)fs.writeFileSync("cache/"+date+'_.txt',tt);
      fs.writeFileSync("cache/"+date+'_'+der_today.mexp[dd]+'.txt',tt);
      
      var expday=der_today.mexp[dd];
      var tableall=der_table_all( date , prevday , expday ,'ta25', 'm', der_sort(der_today.mn[dd])  );
      sql_queue.push(sql(tableall));
      
      
      if((!w)&&dd==d) t=tt;
     });
     
     der_today.wexp.forEach(function(vv,dd)
     {
      var tt=maketext(true,dd);
      if(dd==0)fs.writeFileSync("cache/"+date+'_w.txt',tt);
      fs.writeFileSync("cache/"+date+'_w'+der_today.wexp[dd]+'.txt',tt);
      
      var expday=der_today.wexp[dd];
      var tableall=der_table_all( date , prevday , expday ,'ta25', 'w', der_sort(der_today.wn[dd])  );
      sql_queue.push(sql(tableall));
      
      
      if(w&&dd==d) t=tt;
     });
    if(expand) t=expandtablelines(t);
    return t;
}

var warmup_cache_prevdate

//enter in repl prompt warmup_cache() to warm up cache 
warmup_cache=function()
{
warmup_cache_prevdate=new Date().getTime();
    var files=fs.readdirSync('data').filter(function(file){return getFilesizeInBytes('data/'+file)>200000 }).sort().reverse();
    
    
    //for(var i=0;i<files.length-2;i++)
    var i=0;
    async.whilst(
    function () { return i<files.length-2; },
    function (callback) {
     console.log(files[i].substr(4,8),i+1,"of",files.length-2,Math.round((i*100)/(files.length-3))+"%",(new Date().getTime()-warmup_cache_prevdate)/1000,'seconds prev file');
     warmup_cache_prevdate=new Date().getTime();
     get_date(false,files[i].substr(4,8),false,false);     
     i++;
     setTimeout(callback, 500);
    },
    function (err) {
        console.log('warm up done');
     }
    );

    
    
}
  


///cron - remember to get files.

var syncd=new Date(); if(syncd.getHours()<19)syncd.setHours(19); else syncd.setHours(19+24);
 synctimeout=setTimeout(function(){sync(warmup_cache);syncinterval=setInterval(function(){sync(warmup_cache)},24*60*60*1000)},(syncd.getTime()-(new Date().getTime())));  
  
  
/////////server:
  
require("setimmediate");//for express to work on node less then 10
var express = require("express");
var app = express();
 
 app.use('/',function(req,res,next){
 //log
     console.log('visit',req.connection.remoteAddress,req.originalUrl);
     next();
 })
 
 app.get("/", function(req, res) {
    res.send(":)")
 });
 
 
 app.get("/sync", function(req, res) { 
    sync(function(){
        res.send("OK");
    });
 });
 
 
 app.param("date", function(req, res, next, val) {
     if(val.match(/^\d{8}$/))
     {
      if(!fs.existsSync("data/Full"+val+"0.zip"))
       res.send("error: no data for this date "+val); 
      else
        next(); 
     }
     else
      res.send("error: /date/yyyymmdd"); 
 });
 app.param("expdate", function(req, res, next, val) { if(val.match(/^\d{8}$/)) next(); else res.send("error: /date/yyyymmdd/expdate/yyyymmdd"); });
 
 app.get("/date", function(req, res) {
    res.header("Content-Type", "text/plain; charset=utf-8");
    res.send(get_dates())
 });
 
 
 app.get("/date/w", function(req, res) {
    res.header("Content-Type", "text/plain; charset=utf-8");
    res.send(get_dates_w())
 });
 
 
 
 app.get('/date/:date/w', function(req, res) {
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.send(get_date(true,req.params.date));
 });
 app.get('/date/:date/w:expdate', function(req, res) {
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.send(get_date(true,req.params.date,req.params.expdate));
 });
 
 app.get('/date/:date/:expdate', function(req, res) {
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.send(get_date(false,req.params.date,req.params.expdate));
 });
 
 app.get('/date/:date', function(req, res) {
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.send(get_date(false,req.params.date));
 });
 
 var port = process.env.PORT || 5000;
 app.listen(port, function() { console.log("Listening on " + port); });

 
/*
Table 104 – Currencies
Code Currency Name ISO
01 New Israeli Shekel (NIS) ILS
02 US Dollar USD
03 Swiss Franc CHF
04 S.D.R (Special Drawing Rights)
05 Deutchemark DEM
06 Dutch Florin NLG
07 British Pound GBP
08 Japanese Yen / 100 JPY
09 French Franc FRF
10 Canadian Dollar CAD
11 E.C.U. EUR
12 Swedish Krone SEK
13 Australian Dollar AUD
14 Spanish Peseta / 100 ESP
17 South African Rand ZAR
18 Israel Basket of Currencies
20 Gold (In US Dollars)
21 Jordanian Dinar JOD
23 Turkish Lira TRL
25 Egyptian Pound EGP
26 Lebanese Pound LBP
27 Finish Mark FIM
28 Norwegian Krone NOK
29 Danish Krone DKK
30 Euro EUR
*/
/*
Table 304 – Reason for Trade Suspension 
Code, Reason for Trade Suspension.
01 Issue of subsidiary company
02 Notice by subsidiary / related company
03 Publication of financial statements by subsidiary / related company
04 Changes in security terms
05 Notice on capital consolidation
06 Bond grading
07 Low marketability
09 Publication of first quarter balance sheet
10 Publication of third quarter balance sheet
11 Publication of annual balance sheet
12 Publication of half year balance sheet
13 Publication of quarterly balance sheet
14 Significant transaction
15 Distribution of dividend
16 Distribution of bonus
17 Notification of public offering
18 Rights issue
19 Rights ratio notification
21 Notification of issue price
22 Notification of increase of capital
23 Forced redemption / prior redemption
24 Company noticeFebruary 26, 2013
25 Stock exchange notice
26 Tender offer / Merger
31 Before drawing
32 Before final redemption
33 Before last day of conversion
41 Irregular operation in stock exchange
42 Large conversion
43 Wrong price publication
44 Delisting
45 Wrong yield publication
46 Stock exchange error
47 Technical suspension
48 Sharp fluctuation in index
49 Exceptional order
50 Special opening phase at end of day
51 Lack of transparency in the company’s business
52 Non-publication of financial reports
53 Appointment of receiver / liquidator
54 Setting up of immediate redemption
55 Trade suspension in the underlying asset
56 Publication of financial statements of underlying asset
57 Notification of underlying asset
58 Price Fluctuation
59 Exercise on record date
60 Price 1 Agora
61 Due to Consolidation / Reduction of Capital
91 Non-publication of prospectus
92 Non-trading day for currency
93 Non-trading day for currency and non-publication of prospectus
94 Mutual fund not traded on Sundays
95 Mutual fund not registered with clearing houseFebruary 26, 2013
96 Mutual fund manager’s announcement
97 Mutual fund not active
99 General
*/

/*
Table 510 – TACT Indices
Index, Index Name, Comments
1 TA - 100
2 TA - 25
3 TA Blue Tech , TA Blue Tech 50 replaces Tel Tech from 03/04/2011 TA Blue Tech replaces Blue Tech 50 from 15/06/2014
4 TA - 75
5 TA - Banking
6 Tel - Tech 15, Cancelled from 03/04/2011
7 TA MidCap - 50
8 TA - Finance
9 TA RealEstate - 15
10 TA - Midcap , Name change from Yeter Tel Aviv from 28/3/2011 11
12 TA - Maala
13 Tel - Div , Name change from Tel - Div 20 from 03/04/2011
14 Tel - Bond 20
15 Tel - Bond 40
16 Tel - Bond 60
17 Tel - Bond Shekel Fixed Interest
18 TA - Biomed
19 TA - Technology
20 TA - Oil & Gas
21 TA - Insurance
22 TA - Com
23 Tel Bond – CPI Linked
24 Tel Bond – CPI Linked SmallCap
25 Tel Bond – CPI Linked Bank
26 Tel Bond - Yields
27 Tel Bond - Composite
28 TA Tech-Elite
168 TA - Composite
*/

/*
Table 602 – Derivatives Underlying Assets
Underlying Asset Code, Underlying Asset Description, Deleted from  Date
01 TA-25
02 Dollar
03 3 Months Interest Rate 07/10/2009
04 TA-Banks
05 Euro
06 Medium Term Shahar 12/03/2008
07 Long Term Shahar 12/03/2008
08 ICL Share
09 Poalim Share
10 Leumi Share
11 Teva Share
12 Discount Share
13 Mizrahi Tefahot Share
14 Avner Participation Unit
15 Isramco Participation Unit 29/04/2012
16 Ratio Participation Unit
17 Government Bond 0120 (A)
18 Government Bond 0217 (B) 16/02/2014
19 Bezeq Share
20 Perrigo Share
21 TA-100
*/
/*
Table 605 – Derivatives Underlying Asset Types
Underlying Underlying Asset Type Description
Asset Type
01 Share Index
02 Currency Rate
03 Interest Rate
04 Equity
05 Government Bonds
*/




// to craete table  run der_table_all_sql function in node repl to return table structure
// example:

// require('fs').writeFileSync('table.sql', der_table_all_sql() );
   
    var mysql      = require('mysql');
    
    dbclient = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'rasefiles',
      //debug: true
    });
    
    dbclient.connect();
    
    function handleDisconnect(connection) {
      connection.on('error', function(err) {
        if (!err.fatal) {
          return;
        }
    
        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
          throw err;
        }
    
        console.log('Re-connecting lost connection: ' + err.stack);
    
        dbclient = mysql.createConnection(dbclient.config);
        handleDisconnect(dbclient);
        dbclient.connect();
      });
    }
    handleDisconnect(dbclient);
    
    
    var sql_queue = async.queue(function (task, callback) {
        //console.log('sql: ' + task);
        dbclient.query(task,function(err,rows){
         if(err) console.log(task+"\n",'err',err);
         //if(rows) console.log(task.sql+"\n",'rows',rows);
         callback();
        });
    }, 1);
    
    // assign a callback
    sql_queue.drain = function() {
        console.log('all queries have been processed');
    }

// in queris i have missed "where market="ta25" " intentionally add it if you need it  

get_expdates=function(week,cb){ 

var q='select expday from `tasefiles` where monthweek="'+(week?'w':'m')+'" group by expday order by expday desc;';
        dbclient.query(q,function(err,rows){
         if(err) console.log(q+"\n",'err',err);
         //if(rows) console.log(task.sql+"\n",'rows',rows);
         cb(rows.map(function(a){return a.expday}).join('\r\n'));
        });
}

get_highlow=function(week,expday,cb){

var q=''
/* both combined 'last day low hight'  and  'from perv exp day to exp low high' */
+' select a.derid,a.type,a.strike,a.name,b.minday as pexp_minday,b.maxday as pexp_maxday ,b.count as pexp_count,b.high as pexp_high,b.low as pexp_low,a.day as last_day,a.high as last_high,a.low as last_low from \n'
+' ( \n'
/* min max of previous day*/
+' select derid \n'
+' ,`Derivative Type` as type \n'
+' ,`Strike Price` as strike \n'
+' ,`Derivative Hebrew Name` as name \n'
+' ,day as day \n'
+' ,max(`der-02-Highest Price`) as high \n'
+' ,ifnull( min(case `der-02-Lowest Price` when 0 then NULL else `der-02-Lowest Price` END  ) ,0) as low \n'
+' from `tasefiles` where expday='+expday+' and monthweek="'+(week?'w':'m')+'" \n'
+' and day= ( \n'
+' select day from `tasefiles` where monthweek="'+(week?'w':'m')+'" and expday='+expday+' group by day order by day desc limit 1 \n'
+' ) \n'
+' group by derid \n'
+' ) a \n'
+' left join \n'
+' ( \n'
/* min max from previous  exp*/
+' select derid \n'
+' ,min(day) as minday \n'
+' ,max(day) as maxday \n'
+' ,count(id) as count \n'
+' ,max(`der-02-Highest Price`) as high \n'
+' ,ifnull( min(case `der-02-Lowest Price` when 0 then NULL else `der-02-Lowest Price` END  ) ,0) as low \n'
+' from `tasefiles` where expday='+expday+' and monthweek="'+(week?'w':'m')+'" \n'
+' and day> ( \n'
+' select expday from `tasefiles` where monthweek="'+(week?'w':'m')+'" and expday<'+expday+' group by expday order by expday desc limit 1 \n'
+' ) \n'
+' group by derid \n'
+' ) b \n'
+' on a.derid=b.derid \n'
//+' where  a.derid=b.derid \n'
+' order by a.type asc ,a.strike asc \n'

    dbclient.query(q,function(err,rows){
         if(err) console.log(q+"\n",'err',err);
         //if(rows) console.log(task.sql+"\n",'rows',rows);
         cb(
             ['derid','type','strike','name','pexp_minday','pexp_maxday','pexp_count','pexp_high','pexp_low','last_day','last_high','last_low' ].join('\t')+'\r\n'+
             rows.map(function(a){return [a.derid,a.type,a.strike,a.name,a.pexp_minday,a.pexp_maxday ,a.pexp_count,a.pexp_high,a.pexp_low,a.last_day,a.last_high,a.last_low ].join('\t')}).join('\r\n'));
        });
}


 app.get("/expdate", function(req, res) {
    res.header("Content-Type", "text/plain; charset=utf-8");
    get_expdates(false,function(data){res.send(data)})
 });
 
 app.get("/expdate/w", function(req, res) {
    res.header("Content-Type", "text/plain; charset=utf-8");
    get_expdates(true,function(data){res.send(data)})
 });
 
 app.get('/expdate/w:expdate', function(req, res) {
  res.header("Content-Type", "text/plain; charset=utf-8");
  get_highlow(true,req.params.expdate,function(data){res.send(data)})
 });
 
 app.get('/expdate/:expdate', function(req, res) {
  res.header("Content-Type", "text/plain; charset=utf-8");
  get_highlow(false,req.params.expdate,function(data){res.send(data)})
 });
