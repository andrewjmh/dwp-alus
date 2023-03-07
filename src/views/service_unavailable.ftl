<#ftl encoding="utf-8">
<#-- @ftlvariable name="" type="uk.gov.dwp.payments.bankvalidation.ui.views.ServiceUnavailableView" -->
<#import "UI/views/layout.ftl" as layout>
<@layout.layout prefix = "Sorry, there is a problem with the service - ">
    <div class="govuk-width-container">
            <div class="govuk-grid-row">
                <div class="govuk-grid-column-two-thirds" id="error-message">
                    <h1 class="govuk-heading-l">Sorry, there is a problem with the service</h1>
                    <p class="govuk-body">We cannot validate the bank details for you right now.</p>
                    <p class="govuk-body">Try again later.</p>
                    <p class="govuk-body">
                        <a class="govuk-link" href="/">Go back</a> to search for another account.
                    </p>
                </div>
                <div class="govuk-inset-text">
                    <p id="report-incident-text">
                        If this problem keeps happening, report an incident on <a target="_blank" rel="external noopener noreferrer" id="support-link" href="${supportLink}">DWP Place (opens in a new tab)</a> and enter the following details in the brief description box:
                    </p>
                    <ul>
                        <li>CPAD</li>
                        <li>https://bankval.payments-prod-future.dwpcloud.uk/</li>
                    </ul>
                </div>
            </div>
    </div>
</@layout.layout>
