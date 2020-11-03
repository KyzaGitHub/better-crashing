const {
	entities: { Plugin },
	webpack: { React, getModule, getModuleByDisplayName },
	http: { get },
	injector: { inject, uninject },
} = require("powercord");

const { parse } = require("url");
const { format } = require("util");

let ErrorBoundary;
let MaskedLink;
let parser;
let reactErrors;

let originalRes;
let errorArgs;
let url;

class BetterCrashing extends Plugin {}

if (
	(((ErrorBoundary = getModuleByDisplayName("ErrorBoundary", false)),
	(MaskedLink = getModuleByDisplayName("MaskedLink", false)),
	(parser = getModule(["parse", "parseTopic"], false)),
	(async () => {
		if (
			((reactErrors = JSON.parse(
				(
					await get(
						"https://raw.githubusercontent.com/facebook/react/master/scripts/error-codes/codes.json"
					)
				).body.toString()
			)),
			false)
		) {
		}
	})()),
	false)
) {
} else if (
	((BetterCrashing.startPlugin = async function () {
		if (
			((this.loadStylesheet("style.css"),
			inject(
				"better-crashing-crash-event",
				ErrorBoundary.prototype,
				"componentDidCatch",
				(args) => {
					try {
						(this.reactError = args[1].componentStack
							.toString()
							.split("\n")
							.filter((line) => line.trim() !== "")
							.map((line) => line.trim())
							.join("\n")),
							(this.reactErrorURL = args[0].message.substring(
								args[0].message.indexOf("; visit ") + 8,
								args[0].message.indexOf(" for the full message")
							)),
							(this.importantComponents = [
								...new Set(
									this.reactError
										.split("\n")
										.filter(
											(line) => line.indexOf("in ") === 0
										)
										.map((line) => line.replace("in ", ""))
								),
							].slice(0, 5));
					} catch (e) {
						this.error(e);
					}
				}
			),
			inject(
				"better-crashing-error-boundary",
				ErrorBoundary.prototype,
				"render",
				(args, res) => {
					if (!res.props.action) return res;
					originalRes = res;
					try {
						if (
							((res.props.title = "This is not cute."),
							((res.props.note.props.children = [
								React.createElement(
									"p",
									{},
									"Better Crashing caught an error. Spam ping Bowser in the Powercord server for support." // Placeholder string. Replace before releasing.
								),
								React.createElement(
									"p",
									{},
									reactErrors
										? "Don't forget to copy the simplified error below!"
										: "Don't forget to copy the URL and the simplified error below!"
								),
								reactErrors
									? ""
									: React.createElement(
											"p",
											{},
											React.createElement(MaskedLink, {
												href: this.reactErrorURL,
												title: this.reactErrorURL,
												trusted: () => {
													return true;
												},
											})
									  ),
								parser.defaultRules.codeBlock.react(
									{
										content: reactErrors
											? ((url = parse(
													this.reactErrorURL,
													true
											  )),
											  url.query["args[]"]
													? Array.isArray(
															url.query["args[]"]
													  )
														? (errorArgs =
																url.query[
																	"args[]"
																])
														: (errorArgs = [
																url.query[
																	"args[]"
																],
														  ])
													: (errorArgs = []),
											  `React Invariant Violation #${
													url.query.invariant
											  }\n${format(
													reactErrors[
														url.query.invariant
													],
													...errorArgs
											  )}`) +
											  "\n\nTop 5 Components:\n" +
											  this.importantComponents.join(
													"\n"
											  )
											: `Top 5 Components:\n${this.importantComponents.join(
													"\n"
											  )}`,
									},
									null,
									{}
								),
								React.createElement(
									"p",
									{},
									"Only copy the full error below if needed."
								),
								parser.defaultRules.codeBlock.react(
									{ content: this.reactError },
									null,
									{}
								),
							]),
							false))
						) {
						}
						return res;
					} catch (e) {
						return this.error(e), originalRes;
					}
				}
			),
			(ErrorBoundary.prototype.displayName = "ErrorBoundary")),
			false)
		) {
		}
	}),
	(BetterCrashing.pluginWillUnload = function () {
		if (
			(uninject("better-crashing-error-boundary"),
			uninject("better-crashing-crash=event"),
			false)
		) {
		}
	}),
	(module.exports = BetterCrashing),
	false)
) {
}
