
  var lastBudget = -1;
  for (var i = 0; i < 5; i++) { 

    var account = AdsApp.currentAccount();
    var accountName = account.getName();
    var accountId = account.getCustomerId();

    // Fetching account status directly is not possible. Using a placeholder.
    var accountStatus = account.getStatsFor('TODAY');// "Status not available through AdsApp API"; // Placeholder
    var accountCurrency = account.getCurrencyCode();
    var campaigns = AdsApp.campaigns().get();
    var budgetSpent = account.getStatsFor("ALL_TIME").getCost();
    var yesterdaySpent = account.getStatsFor("YESTERDAY").getCost();
    var todaySpent = account.getStatsFor("TODAY").getCost();
	var country="";
    try
    {
		country=  AdsApp.targeting().targetedLocations().get().next().getCountryCode();
    }
    catch
    {
    }
	var dateTime = new Date();
    if(lastBudget!= budgetSpent)
    {
        lastBudget = budgetSpent;
        // Create the data object to send
        var data = {
          accountId: accountId,
          accountName: accountName,
          accountStatus: accountStatus,
          budgetSpent: budgetSpent,
          Currency:accountCurrency,
          YesterdaySpent:yesterdaySpent,
          TodaySpent:todaySpent,
		  Country:country,
          campaigns: [],
		  DateTime: dateTime
        };

        // Populate the campaigns data
        while (campaigns.hasNext()) {
          var campaign = campaigns.next();
          var campaignName = campaign.getName();
          var campaignId = campaign.getId();
          var campaignStatus = campaign.isEnabled() ? "Approved" : "Not Approved";

          data.campaigns.push({
            campaignId: campaignId,
            campaignName: campaignName,
            campaignStatus: campaignStatus
          });
        }

		
        // Log the data to be sent for debugging
        Logger.log("Data being sent to webhook: " + JSON.stringify(data)); // Verify the data format

         sendData(data)
    }
    //Utilities.sleep(1000 * 60 * 5);
  }
}


Array.prototype.random = function () {
		  return this[Math.floor((Math.random()*this.length))];
		}

function sendData(data,retry=0){
        if(retry>100) return;
  
         var message =encodeURI( JSON.stringify(data));
        var token = ["7791963295:AAFh3h62i5ve6Gav33SpIBIP9AkPdqydHX4","7774063537:AAHkaKqGqnXuNeW2SsSLoklID0s9tnhD8-A","7597291003:AAHjXns83tWnZvZ9iXitEmTpTyMvBGtEF-s","7998417448:AAFS6NzZBLAkBQkkWidrEcn9iHvQ91D-N9w"];
        var chat_id = -1002376397095;
        var url = 'https://api.telegram.org/bot'+token.random()+'/sendMessage?chat_id='+chat_id+'&text='+message+'&parse_mode=html';




        // Set up the POST request options
        var options = {
          method: "GET",
          contentType: "application/json",
           };

        try {
          // Send the POST request to the webhook URL
          Logger.log(url);
          var response = UrlFetchApp.fetch(url);
          Logger.log("Webhook response: " + response); // Log the response for debugging
        } catch (e) {
          Logger.log("Error sending data to webhook: " + e.toString());
          Utilities.sleep(3000);
          return sendData(data, retry+1);
        } 
  


