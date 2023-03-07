<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.HomePageView" -->
<hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

<#if (searchSummaryDto.transactionsSupported?size !=0 && !searchSummaryDto.transactionsSupported?seq_contains("DIRECT_CREDIT")) || searchSummaryDto.errorCodes?size !=0 || (searchSummaryDto.warningCodes?size !=0 && !searchSummaryDto.warningCodes?seq_contains("65"))>
    <div class="govuk-notification-banner govuk-notification-banner--success" id="payments-fail-banner" style="border-color: #d4351c; background-color: #d4351c" role="alert" aria-labelledby="govuk-notification-banner-fail-title" data-module="govuk-notification-banner">
        <div class="govuk-notification-banner__header">
            <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-fail-title">
                Caution
            </h2>
        </div>
        <div class="govuk-notification-banner__content">
            <#if searchSummaryDto.errorCodes?seq_contains("6") || searchSummaryDto.errorCodes?seq_contains("1") || searchSummaryDto.warningCodes?seq_contains("26") || searchSummaryDto.warningCodes?seq_contains("64")>
                <h2 class="govuk-notification-banner__heading" id="error-title">
                    The sort code does not exist. Payments will fail if you use it.
                </h2>
                <p class="govuk-body" id="sortcode-fail-error">
                    Check it and try again.
                </p>
            <#elseif searchSummaryDto.errorCodes?seq_contains("11") || searchSummaryDto.errorCodes?seq_contains("12") || searchSummaryDto.errorCodes?seq_contains("13") || searchSummaryDto.errorCodes?seq_contains("14")>
                <h2 class="govuk-notification-banner__heading" id="error-title">
                    The sort code is no longer valid. Payments will fail if you use it.
                </h2>
                <p class="govuk-body" id="sortcode-fail-error">
                    The sort code is out of date. Use the <a href="${dpigLink}">Direct Payment Input Guide</a> to find out more.
                </p>
            <#elseif searchSummaryDto.sortCodeSearch>
                <h2 class="govuk-notification-banner__heading" id="error-title">
                    Payments made with this sort code will fail.
                </h2>
            <#else>
                <h2 class="govuk-notification-banner__heading" id="error-title">
                    Payments made to this account will fail.
                </h2>
                <#if searchSummaryDto.errorCodes?seq_contains("7")>
                    <p class="govuk-body" id="account-number-fail-error">
                        The account number could not be matched to the sort code.
                    </p>
                <#elseif searchSummaryDto.errorCodes?seq_contains("90")>
                    <p class="govuk-body" id="roll-number-fail-error">
                        The roll or membership number is not in the correct format. Use the <a href="${dpigLink}">Direct Payment Input Guide</a> to check the correct format.
                    </p>
                </#if>
            </#if>

        </div>
    </div>
<#elseif !searchSummaryDto.sortCodeSearch && !searchSummaryDto.warningCodes?seq_contains("65")>
    <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" id="success-title" aria-labelledby="govuk-notification-banner-success-title" data-module="govuk-notification-banner">
        <div class="govuk-notification-banner__header">
            <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-success-title">
                Success
            </h2>
        </div>
        <div class="govuk-notification-banner__content">
            <h3 class="govuk-notification-banner__heading">
                Payments made to this account will be successful.
            </h3>
        </div>
    </div>
</#if>

<#if (searchSummaryDto.institutionName?? || searchSummaryDto.addressLine.LINE_1??) && !searchSummaryDto.warningCodes?seq_contains("26") && !searchSummaryDto.warningCodes?seq_contains("64")>
    <dl class="govuk-summary-list">
        <#if searchSummaryDto.transactionsSupported?? && !searchSummaryDto.errorCodes?seq_contains("7") && !searchSummaryDto.errorCodes?seq_contains("90")>
            <#if !searchSummaryDto.transactionsSupported?seq_contains("FPS")>
                <@supportedTransactionMissing title="Faster Payments" id="no-faster-payments"/>
            </#if>
            <#if !searchSummaryDto.transactionsSupported?seq_contains("AUDDIS") || !searchSummaryDto.transactionsSupported?seq_contains("DIRECT_DEBIT")>
                <@supportedTransactionMissing title="Direct Debit and AUDDIS" id="no-auddis-direct-debit"/>
            </#if>
            <#if !searchSummaryDto.transactionsSupported?seq_contains("DIRECT_CREDIT")>
                <@supportedTransactionMissing title="BACS Credit" id="no-bacs"/>
            </#if>
        </#if>
        <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key" id="bank-details-title">
                Bank name and address
            </dt>
            <dd class="govuk-summary-list__value" id="bank-details-list"><#rt>
                <#t><#if searchSummaryDto.institutionName??>${searchSummaryDto.institutionName}<br></#if>
                <#t><#if searchSummaryDto.branchName??>${searchSummaryDto.branchName},<br></#if>
                <#t><#if searchSummaryDto.addressLine.LINE_1??>${searchSummaryDto.addressLine.LINE_1},<br></#if>
                <#t><#if searchSummaryDto.addressLine.LINE_2??>${searchSummaryDto.addressLine.LINE_2},<br></#if>
                <#t><#if searchSummaryDto.addressLine.LINE_3??>${searchSummaryDto.addressLine.LINE_3},<br></#if>
                <#t><#if searchSummaryDto.addressLine.LINE_4??>${searchSummaryDto.addressLine.LINE_4},<br></#if>
                <#t><#if searchSummaryDto.addressLine.LINE_5??>${searchSummaryDto.addressLine.LINE_5},<br></#if>
                <#t><#if searchSummaryDto.postCode??>${searchSummaryDto.postCode}<br></#if>
            </dd>
        </div>
    </dl>
</#if>

<#macro supportedTransactionMissing title id>
    <div class="govuk-summary-list__row" id="${id}">
        <dt class="govuk-summary-list__key" id="${id}-title">
            ${title}
        </dt>
        <dd class="govuk-summary-list__value" id="${id}-list">
            No
        </dd>
    </div>
</#macro>