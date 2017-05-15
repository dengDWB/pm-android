var channelID=undefined;
function setChannelID(channel)
{
	channelID=channel;
}
var barcodeHandler = undefined
function scanResult(code)
{
	if(typeof barcodeHandler == 'function')
	{
		barcodeHandler(code)
	}
}
function showMessage(message)
{
	try
	{
    if(window.MobileBridge && typeof(window.MobileBridge.showAlert) === "function")
    {
      console.log(message)
      window.MobileBridge.showAlert("提示", message);
    }
		else if(typeof(webContainer) !== "undefined")
    {
		    webContainer.showMessage(message);
		}
    else
    {
        alert(message);
    }
	}
	catch(err)
	{
	    alert(message);
	}
}
function scanBarCode()
{

	try
	{
		if(webContainer)
	  	{
	    	webContainer.scanBarCode();
		}
	}
	catch(err)
	{
		try
		{
			if(navigator.scanBarCode!=undefined)
			{
				navigator.scanBarCode();
			}
			else
		    	alert('不支持该功能，请安装适合的App。');
		}
		catch(err1)
		{
		    alert('不支持该功能，请安装适合的App。');
		}
	}
}
