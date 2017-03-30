var Map = require('es6-map');



class HBLUsers{
  
  constructor() {
    
    this.hbl_users = new Map([
              ['mursil', {allowFBaccess:true, accountBalance:5000,isAccountLinked: false}],
              ['sanya',  {allowFBaccess:true, accountBalance:1000,isAccountLinked: false}],
              ['marium', {allowFBaccess:true, accountBalance:1000,isAccountLinked: false}],
              ['faizan', {allowFBaccess:true, accountBalance:1000,isAccountLinked: false}],
              ['mehwish', {allowFBaccess:false, accountBalance:3000,isAccountLinked: false}]
            ]);
    
 
 }
  iterateUsersMap(){
    console.log('iterating users map');

    this.hbl_users.forEach(function(value, key) {
          console.log(key + ' = ' + value);
    });
    
  }
  
  isFBAccessAllowedForThisUser(HBLID){
    
    let hblid = HBLID.toLowerCase();
    
    if(this.hbl_users.has(hblid) === true)// is a valid HBL Mobile User
      {
        if(this.hbl_users.get(hblid).allowFBaccess === true)// Facebook access is also allowed
          return true;
        else
          return 'facebook access not allowed';
      }
    else
      return 'Invalid User';
    
      
  }
  
  getAccountBalance(HBLID){
    
     let hblid = HBLID.toLowerCase();
     if(this.hbl_users.has(hblid) === true)// is a valid HBL Mobile User
      {
        return this.hbl_users.get(hblid).accountBalance;
          
      }
    else
      return 'Invalid User';
    
  }
  
  
   isUserLinked(HBLID){
    
    // console.log('isUserLinked  called with userid ='+HBLID);
    let hblid = HBLID.toLowerCase();
    //console.log('small case userid ='+hblid);
     this.iterateUsersMap();
     
    if(this.hbl_users.has(hblid) === true)// is a valid HBL Mobile User
      {
      //      console.log('user is present ;'+hblid);

        return this.hbl_users.get(hblid).isAccountLinked;
          
      }
    else
      return 'Invalid User';
   
   }
  
  setUserLink(HBLID,status=true){
    
    let hblid = HBLID.toLowerCase();
    if(this.hbl_users.has(hblid) === true)// is a valid HBL Mobile User
      {
        let user = this.hbl_users.get(hblid);
        user.isAccountLinked = status;        
        return this.hbl_users.set(hblid,user);
          
      }
    else
      return 'Invalid User';
    
    
  }
}

module.exports = HBLUsers;