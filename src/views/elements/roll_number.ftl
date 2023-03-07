<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
<div class="govuk-form-group<#if errors?? && errors.roll\-number??> govuk-form-group--error</#if>">
    <label id="roll-number-text" class="govuk-label" for="roll-number">
        Roll number or membership number (if you have one)
    </label>
    <#if errors?? && errors.roll\-number??>
        <#list errors.roll\-number as error>
            <span id="roll-number-error-${error?index}" class="govuk-error-message">
                        <span class="govuk-visually-hidden">Error:</span>${error}
            </span>
        </#list>
    </#if>
    <input id="roll-number" <#if inputAccountDetailsParam?? && inputAccountDetailsParam.rollNumber??>value="${inputAccountDetailsParam.rollNumber}"</#if> name="roll-number" class="govuk-input govuk-input--width-10<#if errors?? && errors.roll\-number??> govuk-input--error</#if>" type="text"
           spellcheck="false" <#if errors?? && errors.roll\-number??><#list errors.roll\-number as error> roll-number-error-${error?index}</#list></#if>">
</div>