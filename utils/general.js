var dateFormat = require('dateformat');
module.exports = {
	calculation(data) {
		let arr=[];
	    return new Promise(function (resolve, reject) {
	    	data.info.forEach(function(d){
            	let date = new Date(d.date);
            	let yFilter = [{isBannerImage:true}].map(itemY => { return itemY.isBannerImage; });
	            let filteredX = d.activityList.imageUrl.filter(itemX => yFilter.includes(itemX.isBannerImage));
	            let mFilter = [{isCount:true}].map(itemY => { return itemY.isCount; });
	            let filteredN = d.activityList.pricing.filter(itemX => mFilter.includes(itemX.isCount));
				//console.log(filteredN);
				let y='';
				for(let i=0;i<filteredN.length;i++){
					y=y+ filteredN[i].ageGroup +"_" +filteredN[i].count+" "
				}
				console.log(y)
            	let obj={
            		title:d.activityList.title,
            		date:dateFormat(date, "dddd, mmmm dS, yyyy"),
            		slot:d.slot,
            		language:d.activityList.language,
            		totalDuration:Math.trunc((d.activityList.totalDuration/60))+" hrs "+(d.activityList.totalDuration%60)+" mins",
            		imageUrl:filteredX[0].imageId,
					noOfAgeGroup:y
            	}
            	arr.push(obj);
            	if(arr.length==data.info.length){
            		resolve(arr)
            	}
            })
	    });
	},  
};
