
var Map = require('es6-map');


class LinkedUserService{

 constructor() {
    this.linked_accounts = new Map();
 
 }
  
  
 
  
  linkHBLIDwithPSID(psid,HBLID){
    
    if(this.linked_accounts.has(psid) === false)// account is not already linked
    {
      this.linked_accounts.set(psid,HBLID);    
      return true;
      
    }else // Account is already linked
      {
        return false;
      }
    
    
  }

  removeLink(psid){
    
    if(this.linked_accounts.has(psid) === true)// account is already linked
    {
      this.linked_accounts.delete(psid);        // true 
      console.log("account unlinked for psid ="+psid);
      
      return true;
      
    }else // Account is not linked
      {
        console.log("Unable to unlink account for psid ="+psid);
      
        return false;
      }
    
    
  }
  
  getHBLID(psid){
    if(this.linked_accounts.has(psid) === true)
      return this.linked_accounts.get(psid);
    else 
      return false;
    
  }

}


module.exports = LinkedUserService;