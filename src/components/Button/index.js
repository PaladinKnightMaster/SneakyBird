import { styled } from 'twin.macro';
import tw from 'twin.macro';
const Button = styled.button`
    ${tw`capitalize block h-auto rounded-full px-3 py-1 bg-primaryButton text-primaryButtonText shadow-lg hover:text-primaryButtonTextHover`}
`;

export default Button;
