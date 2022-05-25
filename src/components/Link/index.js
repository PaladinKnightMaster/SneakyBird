import Link from 'next/link';
import { useRouter } from 'next/router';
import tw, { styled } from 'twin.macro';
import PropTypes from 'prop-types';

const Component = ({ href, children }) => {
    const router = useRouter();

    const NavLink = styled.a`
        ${tw`p-4 cursor-pointer hover:text-white capitalize`}
        ${router.asPath === href ? tw`text-white` : tw`text-link`}
    `;

    return (
        <Link href={href}>
            <NavLink>{children}</NavLink>
        </Link>
    );
};
Component.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
Component.displayName = 'NavLink';
export default Component;
