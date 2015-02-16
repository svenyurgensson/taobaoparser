// ==UserScript==
// @name TaoBao items info collector
// @description This script collects all the product information and send it to the certain url when user clicks on a certain button
// @author JasonRammoray
// @version 0.1
// @licence GNU GPL v2
// @include http://daogou.taobao.com/market/*
// ==/UserScript==
(function(){
	var config = {
		itemSelector:'.col_item',
		itemNameSelector:'.col_tit .title',
		itemPriceSelector:'.col_aprice',
		itemCartButtonSelector:'.col_saled',
		itemImageSelector:'img',
		snifferSite:'http://www.somesite.ru/script.php',
		snifferButtonAddText:'Grab',
		snifferButtonRemoveText:'Remove',
		snifferButtonCssClass:'product-sniffer',
		debug:true
	};
	
	document.addEventListener('click',function(event){

		// Show the target clicked node in case if debuggin is turned on
		if(config.debug){
			console.log('Clicked node: ', String(event.target.nodeName));
		}

		if(String(event.target.nodeName).toLowerCase() == 'a' && event.target.className.indexOf(config.snifferButtonCssClass) !== -1){
			event.preventDefault();

			if(event.target.className.indexOf('visited') === -1){
				var itemQuantity = Math.abs(parseInt(prompt('Are you sure you want to parse this item? If so, then how much items? The default value is one.'))) || 1;

				if(itemQuantity){
					event.target.dataset.productInfo += '&itemquantity=' + itemQuantity;
					event.target.classList.add('visited');
					event.target.style.backgroundColor = '#008000';
					event.target.innerText = config.snifferButtonRemoveText;
					event.target.style.padding = '0 5px';
					var img = new Image();
					img.src = event.target.dataset.productInfo;

					// If debugging is set then print the product breef information as well as the click event
					if(config.debug){
						console.log('Click for sniffer button detected');
						console.log('The product breef is: ', event.target.dataset.productInfo);
					}

					delete img;
					delete itemQuantity;
				}
			}
			else{
				var deleteConfirmation = prompt('Are you sure you want to delete this item from a parsed database (y/n)?') || 'n';
				if(deleteConfirmation.toLowerCase() === 'y'){

					var productQuantityRegExp = /&itemquantity=\d+/gi;

					var itemName = event.target.dataset.productInfo.match(/name=[^\&]+/gi)[0].split('=')[1];
					var itemQuantity = event.target.dataset.productInfo.match(productQuantityRegExp)[0].split('=')[1];
					var deleteQuery = '?removeitem=y&itemquantity=' + itemQuantity + '&itemname=' + itemName;

					if(config.debug){
						console.log('Delete item query: ', deleteQuery);
					}

					event.target.classList.remove('visited');

					event.target.dataset.productInfo = event.target.dataset.productInfo.replace(productQuantityRegExp,'');

					event.target.innerText = config.snifferButtonAddText;

					event.target.style.padding = '0 15px';
					event.target.style.backgroundColor = '#f00';

					// var img = new Image();
					// img.src = config.snifferSite + deleteQuery;
				}
			}
		}
	},true);

	document.querySelector('body').addEventListener('mousemove',function(event){
		if(String(event.target.nodeName.toLowerCase() == 'div') && event.target.className.indexOf('col_item') !== -1){
			// Caching the current product reference
			var currentItem = event.target;

			if(currentItem.querySelector('.' + config.snifferButtonCssClass) === null){
				// Product image
				var itemImageSrc = encodeURIComponent(currentItem.querySelector(config.itemImageSelector).getAttribute('src'));
				
				// Product price
				var itemPrice = currentItem.querySelector(config.itemPriceSelector).innerText;
				
				// Cache product name because we use it for extracting item name
				// and the item reference

				var item = currentItem.querySelector(config.itemNameSelector);

				// Product name
				var itemName = item.innerText;

				// Product reference
				var itemHref = encodeURIComponent(item.getAttribute('href'));

				// Cart button
				var itemCartButton = currentItem.querySelector(config.itemCartButtonSelector);
				
				// Create a sniffer button
				var snifferButton = document.createElement('a');
				var productBreef = '?img=' + itemImageSrc;
				productBreef += '&name=' + itemName;
				productBreef += '&price=' + itemPrice;
				productBreef += '&href=' + itemHref;

				// Set button attributes
				snifferButton.setAttribute('data-product-info', config.snifferSite + productBreef);
				snifferButton.setAttribute('class', config.snifferButtonCssClass);
				snifferButton.setAttribute('href', '#');
				snifferButton.innerText = config.snifferButtonAddText;

				// Style the button
				snifferButton.style.marginLeft = '13px';
				snifferButton.style.padding = '0 15px';
				snifferButton.style.backgroundColor = '#f00';
				snifferButton.style.border = '1px solid #000';
				snifferButton.style.fontFamily = 'Verdana';
				snifferButton.style.fontSize = '13px';
				snifferButton.style.cursor = 'pointer';
				snifferButton.style.color = '#000';

				// Append the sniffer button
				itemCartButton.parentNode.insertBefore(snifferButton,itemCartButton.nextSibling);
			}
			
		}
	},true);

})();
