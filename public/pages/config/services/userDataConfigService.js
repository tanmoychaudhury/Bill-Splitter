'use strict'
billapp.service('userDataConfigService',function(authService){
    return {
        adminBillAddJson: (weekID,fromDate,billAmount,billDesc)=>{
            return {
                "TYPE": "USER",
                "User_Id": "1111",
                "WEEKID": weekID,
                "First_Name": "Tanmoy",
                "Last_Name": "Chaudhury",
                "BILLDATE": moment(fromDate),
                "YEAR": moment(fromDate).year(),
                "MONTH": moment(fromDate).format('MMM'),
                "AMOUNT": billAmount,
                "BILLDESC": billDesc,
                "CREATED_DATE": moment().toISOString(),
                "MODIFIED_DATE": null,
                "DELETED_DATE": null
            }
        },
        adminBillUpdateJson: (billupdate)=>{
            return {
                "AMOUNT": billupdate.amount,
                "BILLDESC": billupdate.billdesc,
                "MODIFIED_DATE": moment().toISOString()
            }
        },
        userBillAddJson: (billid,name,bill_date,bill_amount,arindam1001,anupam1005,subhasis1002,debu1004,tanmoy1003,surajit1006,bill_desc)=>{
            return {
				"TYPE": "USER_GROUP",
				"BILLID": billid,
				"PAYER": name,
				"BILLDATE": moment(bill_date),
				"AMOUNT": bill_amount,
				"ARINDAM": arindam1001,
				"ANUPAM": anupam1005,
				"SUBHASIS": subhasis1002,
				"DEBU": debu1004,
				"TANMOY": tanmoy1003,
				"SURAJIT": surajit1006,
				"BILLDESC": bill_desc,
				"CREATED_BY": authService.firstname.toLowerCase(),
				"CREATED_DATE": moment().toISOString(),
				"MODIFIED_BY": null,
                "MODIFIED_DATE": null,
  				"DELETED_DATE": null
		    }
        },
        userBillUpdateJson: (dt,billupdate)=>{
            return {
				"BILLDATE": dt,
				"AMOUNT": billupdate.amount,
				"ARINDAM": billupdate.arindam,
				"ANUPAM": billupdate.anupam,
				"SUBHASIS": billupdate.subhasis,
				"DEBU": billupdate.debu,
				"TANMOY": billupdate.tanmoy,
				"SURAJIT": billupdate.surajit,
				"BILLDESC": billupdate.billdesc,
				"MODIFIED_DATE": moment().toISOString(),
				"MODIFIED_BY": authService.firstname.toLowerCase()
			}
        },
        billCycleInfoUpdateJson: (billupdate)=>{
            return {
                "LAST_CLEARANCE_DATE": billupdate.ltdt,
                "CURRENT_BILL_CYCLE_DATE": billupdate.stdt,
                "MODIFIED_BY": billupdate.name,
                "MODIFIED_DATE": moment().toISOString()
            }
        }
    }
})