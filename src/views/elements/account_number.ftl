<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
<div class="govuk-form-group<#if errors?? && errors.account\-number??> govuk-form-group--error</#if>">
    <label id="account-number-text" class="govuk-label" for="account-number">
        Account number
    </label>
    <div id="account-number-hint" class="govuk-hint">
        Must be between 6 and 8 digits long
    </div>
    <#if errors?? && errors.account\-number??>
        <#list errors.account\-number as error>
            <span id="account-number-error-${error?index}" class="govuk-error-message">
                        <span class="govuk-visually-hidden">Error:</span>${error}
            </span>
        </#list>
    </#if>
    <input id="account-number" name="account-number" <#if inputAccountDetailsParam?? && inputAccountDetailsParam.accountNumber??>value="${inputAccountDetailsParam.accountNumber}"</#if> class="govuk-input govuk-input--width-10<#if errors?? && errors.account\-number??> govuk-input--error</#if>" type="text"
           spellcheck="false" aria-describedby="account-number-hint<#if errors?? && errors.account\-number??><#list errors.account\-number as error> account-number-error-${error?index}</#list></#if>">
</div>