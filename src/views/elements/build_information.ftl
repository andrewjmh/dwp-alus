<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
<div id="build-information">
    <#if uiBuildVersion?has_content>
        <span id="ui_build_version">UI build: ${uiBuildVersion}</span>&nbsp;&nbsp;
    </#if>
    <#if buildInfo?? && buildInfo.apiBuildVersion??>
    <span id="api_build_version">API build: ${buildInfo.apiBuildVersion}</span>
    </#if>
</div>