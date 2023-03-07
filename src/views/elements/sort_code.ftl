        <#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
        <div class="govuk-form-group<#if errors?? && errors.sort\-code??> govuk-form-group--error</#if>">
            <label id="sort-code-text" class="govuk-label" for="sort-code">
                Sort code
            </label>
            <div id="sort-code-hint" class="govuk-hint">
                It must be 6 digits long, and you can use spaces, hyphens or dashes
            </div>
            <#if errors?? && errors.sort\-code??>
                <#list errors.sort\-code as error>
                    <span id="sort-code-error-${error?index}" class="govuk-error-message">
                        <span class="govuk-visually-hidden">Error:</span>${error}
                    </span>
                </#list>
            </#if>
            <input id="sort-code" name="sort-code" <#if inputAccountDetailsParam?? && inputAccountDetailsParam.sortCode??>value="${inputAccountDetailsParam.sortCode}"</#if> class="govuk-input govuk-input--width-5<#if errors?? && errors.sort\-code??> govuk-input--error</#if>" type="text" spellcheck="false" aria-describedby="sort-code-hint<#if errors?? && errors.sort\-code??><#list errors.sort\-code as error> sort-code-error-${error?index}</#list></#if>">
        </div>