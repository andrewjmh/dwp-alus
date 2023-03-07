<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.WebApplicationErrorView" -->
<#import "UI/views/layout.ftl" as layout>
<@layout.layout prefix = "This page is unavailable - ">
    <div class="govuk-width-container">
    <div class="govuk-main-wrapper">
        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
                <h1 class="govuk-heading-l" id="error-heading">This page is unavailable</h1>
                <p class="govuk-body" id="error-details">
                    If you typed the web address, check it is correct.
                </p>
                <p class="govuk-body" id="error-additional-details">
                    If you pasted the web address, check you copied the entire address.
                </p>
                <p class="govuk-body">
                    <a class="govuk-link" id="error-homepage-link" href="/">Search for an account</a>
                </p>
            </div>
        </div>
    </div>
</div>
</@layout.layout>
