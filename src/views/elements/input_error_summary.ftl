<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
<#if errors?? && errors?has_content>
    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
        <h2 class="govuk-error-summary__title" id="error-summary-title">
            There is a problem
        </h2>
        <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
                <#if searchSummaryDto?? && searchSummaryDto.warningCodes?seq_contains("65")><li><a href="#${"roll-number"}">This account requires a roll number or membership number.</a></li></#if>

                <#if errors.sort\-code??>
                    <@summary key="sort-code" errorList = errors></@summary>
                </#if>
                <#if errors.account\-number??>
                    <@summary key="account-number" errorList = errors></@summary>
                </#if>
                <#if errors.roll\-number?? && !searchSummaryDto??>
                    <@summary key="roll-number" errorList = errors></@summary>
                </#if>
            </ul>
        </div>
    </div>
</#if>

<#macro summary key errorList>
    <#list errorList['${key}'] as error>
        <li>
            <a href="#${key}">${error}</a>
        </li>
    </#list>
</#macro>
