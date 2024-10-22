import Document, { Html, Head, Main, NextScript } from "next/document";
import { useEffect } from "react";
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }
  // componentDidMount() {
  //   (function (m, e, t, r, i, k, a) {
  //     m[i] =
  //         m[i] ||
  //         function () {
  //           (m[i].a = m[i].a || []).push(arguments);
  //         };
  //     m[i].l = 1 * new Date();
  //     for (var j = 0; j < document.scripts.length; j++) {
  //       if (document.scripts[j].src === r) {
  //         return;
  //       }
  //     }
  //     (k = e.createElement(t)),
  //         (a = e.getElementsByTagName(t)[0]),
  //         (k.async = 1),
  //         (k.src = r),
  //         a.parentNode.insertBefore(k, a);
  //   })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  //   ym(94693588, "init", {
  //     clickmap: true,
  //     trackLinks: true,
  //     accurateTrackBounce: true,
  //     webvisor: true,
  //     ecommerce: "dataLayer",
  //   });
  // }

  render() {
    return (
        <Html>
          <Head>
			<script type="text/javascript" src="//dynamic.criteo.com/js/ld/ld.js?a=111775" async="true"></script>
            <script src="https://splendapp-prod.s3.us-east-2.amazonaws.com/app-69/script/f33786f5-9047-4012-93ec-d6abeae1aac0.js"></script>
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <script
                dangerouslySetInnerHTML={{
                  __html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
						page_path: window.location.pathname,
					});
					`,
                }}
            />
            {/*<script*/}
            {/*    dangerouslySetInnerHTML={{*/}
            {/*        __html: `(function (m, e, t, r, i, k, a) {*/}
            {/*          m[i] =*/}
            {/*            m[i] ||*/}
            {/*            function () {*/}
            {/*              (m[i].a = m[i].a || []).push(arguments);*/}
            {/*            };*/}
            {/*          m[i].l = 1 * new Date();*/}
            {/*          for (var j = 0; j < document.scripts.length; j++) {*/}
            {/*            if (document.scripts[j].src === r) {*/}
            {/*              return;*/}
            {/*            }*/}
            {/*          }*/}
            {/*          (k = e.createElement(t)),*/}
            {/*            (a = e.getElementsByTagName(t)[0]),*/}
            {/*            (k.async = 1),*/}
            {/*            (k.src = r),*/}
            {/*            a.parentNode.insertBefore(k, a);*/}
            {/*        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");*/}
            {/*    */}
            {/*        ym(94693588, "init", {*/}
            {/*          clickmap: true,*/}
            {/*          trackLinks: true,*/}
            {/*          accurateTrackBounce: true,*/}
            {/*          webvisor: true,*/}
            {/*          ecommerce: "dataLayer",*/}
            {/*        });`,*/}
            {/*    }}*/}
            {/*/>*/}
            <script />
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM}`}
            />
            <script
                dangerouslySetInnerHTML={{
                  __html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${process.env.NEXT_PUBLIC_GTM}', {
						page_path: window.location.pathname,
						value:1
						});
					`,
                }}
            />

            <script
                dangerouslySetInnerHTML={{
					__html: `// Initialize window.dataLayerYM
					window.dataLayerYM = window.dataLayerYM || [];
					// Step 1: Capture the product's title from the website
					var productTitleElement = document.querySelector('.product-title'); // Adjust the selector as needed
					console.log(document.querySelector('.product-title'))
					var productTitle = productTitleElement ? productTitleElement.textContent : '';
					var productIdElement = document.querySelector('.product-id'); // Adjust the selector as needed
					var productId = productIdElement ? productIdElement.textContent : '';
					var productPriceElement = document.querySelector('.product-price'); // Adjust the selector as needed
					var productPrice = productIdElement ? productPriceElement.textContent : '';
					var productBrandElement = document.querySelector('.product-brand'); // Adjust the selector as needed
					var productBrand = productIdElement ? productBrandElement.textContent : '';
					var productCategoryElement = document.querySelector('.product-category'); // Adjust the selector as needed
					var productCategory = productIdElement ? productCategoryElement.textContent : '';
					var productVariantElement = document.querySelector('.product-variant'); // Adjust the selector as needed
					var productVariant = productIdElement ? productVariantElement.textContent : '';
					var productQuantityElement = document.querySelector('.product-quantity'); // Adjust the selector as needed
					var productQuantity = productIdElement ? productQuantityElement.textContent : '';
					console.log("product triggered");
					// Step 2: Push the dataLayer object directly to the dataLayerYM array
					window.dataLayerYM.push({
					ecommerce: {
						currencyCode: 'EGP',
						purchase: {
						actionField: {
							id: 'TRX987'
						},
						products: [
							{
							id: productId,
							name: productTitle, // Use the captured product title here
							price:productPrice,
							brand:productBrand,
							category: productCategory,
							variant: productVariant,
							quantity: productQuantity,
							}
							// Add more products if needed
						]
						}
					}
					});`,
                }}
            />

            <script
                dangerouslySetInnerHTML={{
                	__html: `
						var productTitleElement = document.querySelector('.product-title'); // Adjust the selector as needed
						console.log(document.querySelector('.product-title'))
						var productTitle = productTitleElement ? productTitleElement.textContent : '';
						var productIdElement = document.querySelector('.product-id'); // Adjust the selector as needed
						var productId = productIdElement ? productIdElement.textContent : '';
						var productPriceElement = document.querySelector('.product-price'); // Adjust the selector as needed
						var productPrice = productIdElement ? productPriceElement.textContent : '';
						var productBrandElement = document.querySelector('.product-brand'); // Adjust the selector as needed
						var productBrand = productIdElement ? productBrandElement.textContent : '';
						var productCategoryElement = document.querySelector('.product-category'); // Adjust the selector as needed
						var productCategory = productIdElement ? productCategoryElement.textContent : '';
						var productVariantElement = document.querySelector('.product-variant'); // Adjust the selector as needed
						var productVariant = productIdElement ? productVariantElement.textContent : '';
						var productQuantityElement = document.querySelector('.product-quantity'); // Adjust the selector as needed
						var productQuantity = productIdElement ? productQuantityElement.textContent : '';
						console.log("cart add product triggered",productTitle);
						window.dataLayerYM = window.dataLayerYM || [];
						dataLayerYM.push({ 
						"ecommerce": { 
						"currencyCode": "EGP",
						"add": { 
						"products": [ { 
						"id": productId, 
						"name":productTitle, 
						"price": productPrice, 
						"quantity": productQuantity 
						} ] } }});
					`,
                }}
            />

            <script
                dangerouslySetInnerHTML={{
					__html: `
						var productTitleElement = document.querySelector('.product-title'); // Adjust the selector as needed
						console.log(document.querySelector('.product-title'))
						var productTitle = productTitleElement ? productTitleElement.textContent : '';
						var productIdElement = document.querySelector('.product-id'); // Adjust the selector as needed
						var productId = productIdElement ? productIdElement.textContent : '';
						var productPriceElement = document.querySelector('.product-price'); // Adjust the selector as needed
						var productPrice = productIdElement ? productPriceElement.textContent : '';
						var productBrandElement = document.querySelector('.product-brand'); // Adjust the selector as needed
						var productBrand = productIdElement ? productBrandElement.textContent : '';
						var productCategoryElement = document.querySelector('.product-category'); // Adjust the selector as needed
						var productCategory = productIdElement ? productCategoryElement.textContent : '';
						var productVariantElement = document.querySelector('.product-variant'); // Adjust the selector as needed
						var productVariant = productIdElement ? productVariantElement.textContent : '';
						var productQuantityElement = document.querySelector('.product-quantity'); // Adjust the selector as needed
						var productQuantity = productIdElement ? productQuantityElement.textContent : '';
						console.log("cart remove product triggered",productTitle);
						window.dataLayerYM = window.dataLayerYM || [];
						dataLayerYM.push({ 
						"ecommerce": { 
						"currencyCode": "EGP",
						"remove": { 
						"products": [ { 
						"id": productId, 
						"name":productTitle, 
						"quantity": productQuantity 
						} ] } }});
					`,
				}}
            />

            {/*<noscript>*/}
            {/*    <div>*/}
            {/*        <img*/}
            {/*            src="https://mc.yandex.ru/watch/94693588"*/}
            {/*            style={{ position: "absolute", left: "-9999px" }}*/}
            {/*            alt=""*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</noscript>*/}
			<script
			dangerouslySetInnerHTML={{
				__html: `
				(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id=%27+i+dl;f.parentNode.insertBefore(j,f);
				})(window,document,'script','dataLayer','GTM-PFVXR3S');
				`,
			}}
			/>
          </Head>
          <body>
			<noscript
			dangerouslySetInnerHTML={{
				__html: `
				<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PFVXR3S"
				height="0" width="0" style="display:none;visibility:hidden"></iframe>
				`,
			}}
			/>
          <Main />
          <NextScript />
          </body>
        </Html>
    );
  }
}

export default MyDocument;
