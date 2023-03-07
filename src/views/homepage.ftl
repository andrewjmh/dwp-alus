<#ftl encoding="utf-8">
<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
<#import "UI/views/layout.ftl" as layout>
<@layout.layout>
    <!-- here will add our content -->
    <#include "UI/views/elements/input_error_summary.ftl">
    <h1 id="page-title" class="govuk-heading-l">Find an account</h1>

    <form action="/" method="post" class="form" autocomplete="off">
        <#include "UI/views/elements/sort_code.ftl">
        <#include "UI/views/elements/account_number.ftl">
        <#include "UI/views/elements/roll_number.ftl">
        <div class="govuk-button-group">
            <input id="search-button" value="Search" type="submit" name="search-button" class="govuk-button"
                   data-module="govuk-button">
            <#if inputAccountDetailsParam??>
                <a id="clear-search-button" href="/" class="govuk-button govuk-button--secondary"
                   data-module="govuk-button" role="button">
                    Clear Search
                </a>
            </#if>
        </div>
    </form>
    <#if searchSummaryDto??>
            <#include "UI/views/elements/search_results.ftl">
        </#if>
</@layout.layout>
