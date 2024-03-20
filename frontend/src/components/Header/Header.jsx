import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme.js";

const Header = ({ title, subtitle, dataID }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box>
            <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 1px 0" }}
            >
                {title}
            </Typography>
            <Typography variant="h5" color={colors.primary[100]}>
                {subtitle}
            </Typography>

            <Typography sx={{ display: "none" }} variant="h5" color={colors.primary[100]}>
                {dataID}
            </Typography>
        </Box>
    );
};

export default Header;