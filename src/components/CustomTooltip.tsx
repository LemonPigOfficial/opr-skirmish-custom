import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const CustomTooltip = styled(
  ({ className, leaveTouchDelay = 5 * 60 * 1000, ...props }: TooltipProps) => (
    <Tooltip {...props} leaveTouchDelay={leaveTouchDelay} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(0,0,0,.75)",
    padding: "8px",
    fontSize: "14px",
  },
}));
