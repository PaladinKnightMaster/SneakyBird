/* eslint-disable jsx-a11y/anchor-is-valid */
import Button from '../Button';
import PropTypes from 'prop-types';
import tw from 'twin.macro';
import NavLink from '../Link';
import { useRouter } from 'next/router';

const Header = tw.header`flex justify-end px-5 py-2 bg-headerBackground`;
const List = tw.ul`flex`;
// const NavLink = tw.a`p-4 cursor-pointer text-link hover:text-white capitalize`;
const NavContainer = tw.nav`flex mr-32`;

function HeaderComponent({ onWalletConnect, address }) {
    const router = useRouter();

    return (
        <Header>
            <NavContainer>
                {router.asPath !== '/' && (
                    <div>
                        <NavLink href="/">Back to Mint</NavLink>
                    </div>
                )}
                <List>
                    <li>
                        <NavLink href="/about">about</NavLink>
                    </li>
                    <li>
                        <NavLink href="/faq">faq</NavLink>
                    </li>
                    <li>
                        <NavLink href="/forge">forge</NavLink>
                    </li>
                </List>
            </NavContainer>

            <div>
                {address ? (
                    <span className="ellipsis">{address}</span>
                ) : (
                    <Button onClick={onWalletConnect}> Connect Wallet </Button>
                )}
            </div>
        </Header>
    );
}

HeaderComponent.propTypes = {
    onWalletConnect: PropTypes.func.isRequired,
    address: PropTypes.string,
};

export default HeaderComponent;
