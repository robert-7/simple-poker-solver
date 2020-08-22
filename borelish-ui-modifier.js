var newRowContent = "<tr><td>newcontent</td><td>newcontent2</td><td>newcontent3</td></tr>";
$(document).ready(function() {	
	$( "#ok" ).click(function() {
		
		// empty the table
		$("tbody tr").remove();
		
		// place a waiting string while we're searching for saddle points
		var waitString = "<tr><td></td><td>Please wait...</td><td></td></tr>";
		$("tbody").append(waitString);
		
		// find saddle points
		var ante = $('#ante').val();
		var bet = $('#bet').val();
		var numCards = $('#numCards').val();
		var saddlePoints = findSaddlePoints(ante, bet, numCards);
		
		// remove the waiting string
		$("tbody tr").remove();
		
		// if we have no saddle points
		if (saddlePoints.length == 0) {
			var nullStr = "<tr><td></td><td>No Saddle Points</td><td></td></tr>";
			$("tbody").append(nullStr);
			
		// otherwise, we printing/populate the table with saddle points
		} else {
			for (i = 0; i < saddlePoints.length; i++) { 
		
				var saddlePoint = saddlePoints[i],
					
				str = "<tr><td>%PURE1%</td><td>%PURE2%</td><td>%VALUE%</td></tr>";

				str = str.replace(/%\w+%/g, function(all) {
					return saddlePoint[all] || all;
				});
				
				$("tbody").append(str);
			}
		}
	}); 
});
