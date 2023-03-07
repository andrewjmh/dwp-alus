<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
<#macro layout prefix = "">
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!-- Ensure that older IE versions always render with the correct rendering engine -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title><#if (errors?? && errors?size !=0)>Error: </#if>${prefix}Check Payment Account Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/assets/images/favicon.ico">
        <link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon"/>
        <meta name="theme-color" content="#0b0c0c"/>
        <link rel="mask-icon" href="/assets/images/govuk-mask-icon.svg" color="#0b0c0c">

        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/govuk-apple-touch-icon-180x180.png">
        <link rel="apple-touch-icon" sizes="167x167" href="/assets/images/govuk-apple-touch-icon-167x167.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/govuk-apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" href="/assets/images/govuk-apple-touch-icon.png">

        <!--[if IE 8]>
        <link rel="stylesheet" href="/assets/govuk-frontend-ie8-3.12.0.min.css">
        <![endif]-->
        <!--[if !IE 8]><!-->
        <link rel="stylesheet" href="/assets/govuk-frontend-3.12.0.min.css">
        <!--<![endif]-->
    </head>
    <body class="govuk-template__body ">
    <script>document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');</script>
    <a href="#main-content" class="govuk-skip-link">Skip to main content</a>
    <header>
        <#include "UI/views/elements/header.ftl">
        <#include "UI/views/elements/phase_banner.ftl">
    </header>
    <main>
        <div id="main-content" class="govuk-main-wrapper govuk-width-container">
            <#nested/>
        </div>
    </main>
    <footer>
        <#include "UI/views/elements/footer.ftl">
        <!-- build info -->
        <#include "UI/views/elements/build_information.ftl">
    </footer>
    <script src="/assets/govuk-frontend-3.12.0.min.js"></script>
    <script>
        window.GOVUKFrontend.initAll()
    </script>
    </body>
    </html>
</#macro>
