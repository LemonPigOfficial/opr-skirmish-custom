export const transformRuleText = (rule: string) => rule.replace(
  /take(s)? (\d+) hits?/,
  (_, ...grps) => `take${grps[0] || ""} ${parseInt(grps[1]) * 3} hits`
)