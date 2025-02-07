import { SpecialRule } from "@/services/interfaces";
import { useAppStore } from "@/services/store";
import { groupBy, sumBy } from "lodash";
import { Fragment } from "react";
import { useShallow } from "zustand/shallow";
import RuleItem from "./RuleItem";
import { transformRuleText } from "@/services/helpers";

interface RuleListProps {
  unit?: { size: number };
  specialRules: SpecialRule[];
}

const attackRules = ["Impact"];

export default function RuleList({ unit, specialRules }: RuleListProps) {
  const { rules, listResponse, attackMultiplier } = useAppStore(useShallow((state) => state));
  const ruleDefinitions = rules.concat(listResponse?.specialRules ?? []).map((x) => ({
    ...x,
    description: transformRuleText(x.description, attackMultiplier),
  }));

  if (!specialRules || specialRules.length === 0) return null;

  const ruleGroups = groupRules(specialRules, unit?.size === 1);

  return (
    <>
      {ruleGroups.map((rule, index) => {
        const ruleDefinition = ruleDefinitions.filter(
          (r) => /(.+?)(?:\(|$)/.exec(r.name)?.[0] === rule.name
        )[0];

        const name = rule.name;
        const rating = attackRules.includes(rule.name)
          ? rule.rating * attackMultiplier
          : rule.rating;

        const label = `${
          unit && rule.count && rule.count !== unit.size ? `${rule.count}x ` : ""
        }${name}${rating ? `(${rating})` : ""}`;

        const description =
          (rule.rating ? `${name}(X)` : name) +
          ": " +
          ((rule as any).description || ruleDefinition?.description || "");

        return (
          <Fragment key={name}>
            {index > 0 && <span style={{ marginRight: "2px" }}>, </span>}
            <RuleItem key={name} label={label} description={description} />
          </Fragment>
        );
      })}
    </>
  );
}

const groupRules = (rules: SpecialRule[], forceStack: boolean = false) => {
  const groups = groupBy(rules, (rule) => rule.name);
  return Object.keys(groups).map((key) => {
    const group = groups[key];
    const rule = group[0];
    const stack = rule.rating && (forceStack || rule.name === "Tough");
    const isStringRating = rule.rating && isNaN(parseInt(rule.rating as string));
    const rating =
      !rule.rating || isNaN(parseInt(rule.rating as string))
        ? null
        : stack
        ? group.reduce(
            (total, next) => (next.rating ? total + parseInt(next.rating as any) : total),
            0
          )
        : Math.max(...group.map((rule) => parseInt(rule.rating as any)));
    return {
      ...rule,
      count: stack ? 0 : sumBy(group, (x: any) => x.count || 1),
      rating: isStringRating ? rule.rating : rating?.toString(),
    };
  });
};

//export const MemoisedRuleList = memo(RuleList);
